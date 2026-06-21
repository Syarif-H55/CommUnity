"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import AuthGuard from "@/components/auth/AuthGuard"
import { useOrganization, useUploadDocument, useOrganizationMembers, useAddMember, useUpdateMemberRole, useRemoveMember } from "@/hooks/useOrganization"
import { useAuthStore } from "@/stores/auth.store"
import { useLogout } from "@/hooks/useAuth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DocumentUpload, VerificationTimeline } from "@/components/organization"
import {
    Handshake, ArrowLeft, Building2, LogOut, Loader2, Calendar,
    Users, Shield, Clock, CheckCircle, XCircle, Mail, MapPin, FileText,
    UserPlus, UserMinus, ChevronDown
} from "lucide-react"

function OrganizationDetailContent() {
    const params = useParams()
    const id = params.id as string
    const user = useAuthStore((state) => state.user)
    const logout = useLogout()
    const { data: organization, isLoading, error } = useOrganization(id)
    const uploadDoc = useUploadDocument(id)
    const { data: members, isLoading: membersLoading } = useOrganizationMembers(id)
    const addMember = useAddMember(id)
    const updateRole = useUpdateMemberRole(id)
    const removeMember = useRemoveMember(id)

    const [showAddMember, setShowAddMember] = useState(false)
    const [newUserId, setNewUserId] = useState("")
    const [newUserRole, setNewUserRole] = useState<"Penyelenggara" | "Koordinator Event">("Koordinator Event")
    const [searchUser, setSearchUser] = useState("")
    const [editingRole, setEditingRole] = useState<string | null>(null)
    const [editRoleValue, setEditRoleValue] = useState<"Penyelenggara" | "Koordinator Event">("Koordinator Event")

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <div className="text-center">
                    <Loader2 className="mx-auto size-8 animate-spin text-emerald-600" />
                    <p className="mt-4 text-sm text-muted-foreground">Memuat organisasi...</p>
                </div>
            </div>
        )
    }

    if (error || !organization) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="py-12">
                        <XCircle className="mx-auto size-12 text-destructive mb-4" />
                        <CardTitle className="text-lg">Organisasi Tidak Ditemukan</CardTitle>
                        <CardDescription className="mt-2">
                            Organisasi yang Anda cari tidak tersedia atau telah dihapus.
                        </CardDescription>
                        <Link
                            href="/organizations"
                            className="mt-6 inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background px-2.5 h-8 gap-1.5 text-sm font-medium whitespace-nowrap text-foreground hover:bg-muted hover:text-foreground transition-all"
                        >
                            Kembali
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const handleAddMember = () => {
        addMember.mutate({ user_id: newUserId, role: newUserRole }, {
            onSuccess: () => {
                setShowAddMember(false)
                setNewUserId("")
                setNewUserRole("Koordinator Event")
                setSearchUser("")
            },
        })
    }

    const handleRemoveMember = (userId: string, name: string) => {
        if (window.confirm(`Hapus ${name} dari organisasi ini?`)) {
            removeMember.mutate(userId)
        }
    }

    const handleUpdateRole = (userId: string, role: "Penyelenggara" | "Koordinator Event") => {
        updateRole.mutate({ userId, role })
        setEditingRole(null)
    }

    const statusColors: Record<string, "warning" | "success" | "destructive"> = {
        pending: "warning",
        approved: "success",
        rejected: "destructive",
    }
    const statusLabels: Record<string, string> = {
        pending: "Menunggu Verifikasi",
        approved: "Terverifikasi",
        rejected: "Ditolak",
    }
    const statusIcons: Record<string, React.ReactNode> = {
        pending: <Clock className="size-4" />,
        approved: <CheckCircle className="size-4" />,
        rejected: <XCircle className="size-4" />,
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50 dark:from-emerald-950/20 dark:via-background dark:to-emerald-950/20">
            <header className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur-sm dark:bg-background/80">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/organizations"
                            className="flex size-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted/50 transition-colors"
                        >
                            <ArrowLeft className="size-5" />
                        </Link>
                        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600">
                            <Handshake className="size-5 text-white" />
                        </div>
                        <span className="text-lg font-semibold tracking-tight truncate max-w-[200px]">
                            {organization.name}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            onClick={() => logout.mutate(undefined, { onSuccess: () => window.location.href = "/login" })}
                            disabled={logout.isPending}
                            className="gap-2"
                        >
                            {logout.isPending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-6 py-8 space-y-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 p-8 text-white">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
                    <div className="relative flex flex-col sm:flex-row items-start gap-6">
                        <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                            {organization.logo_url ? (
                                <img
                                    src={organization.logo_url}
                                    alt={organization.name}
                                    className="size-full rounded-2xl object-cover"
                                />
                            ) : (
                                <Building2 className="size-10" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                <div>
                                    <h1 className="text-2xl font-bold">{organization.name}</h1>
                                    <p className="text-emerald-100/80 text-sm mt-1">
                                        Bergabung sejak {new Date(organization.created_at).toLocaleDateString("id-ID", {
                                            year: "numeric", month: "long", day: "numeric"
                                        })}
                                    </p>
                                </div>
                                <Badge
                                    variant={statusColors[organization.verification_status]}
                                    className="flex items-center gap-1.5 text-sm px-3 py-1"
                                >
                                    {statusIcons[organization.verification_status]}
                                    {statusLabels[organization.verification_status]}
                                </Badge>
                            </div>
                            {organization.description && (
                                <p className="mt-3 text-emerald-100/80 text-sm leading-relaxed max-w-2xl">
                                    {organization.description}
                                </p>
                            )}
                            {organization.verified_at && (
                                <p className="mt-3 flex items-center gap-1.5 text-xs text-emerald-200/70">
                                    <CheckCircle className="size-3.5" />
                                    Terverifikasi pada {new Date(organization.verified_at).toLocaleDateString("id-ID", {
                                        year: "numeric", month: "long", day: "numeric"
                                    })}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="overview">
                    <TabsList>
                        <TabsTrigger value="overview">Ringkasan</TabsTrigger>
                        <TabsTrigger value="verification">Verifikasi</TabsTrigger>
                        <TabsTrigger value="documents">Dokumen</TabsTrigger>
                        <TabsTrigger value="members">Anggota</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            <Card className="border-emerald-100/50 shadow-sm">
                                <CardContent className="flex items-center gap-4 py-5">
                                    <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <Users className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{organization.member_count ?? "—"}</p>
                                        <p className="text-xs text-muted-foreground">Anggota</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-emerald-100/50 shadow-sm">
                                <CardContent className="flex items-center gap-4 py-5">
                                    <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <Calendar className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{organization.event_count ?? "—"}</p>
                                        <p className="text-xs text-muted-foreground">Event</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-emerald-100/50 shadow-sm sm:col-span-2 lg:col-span-1">
                                <CardContent className="flex items-center gap-4 py-5">
                                    <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        <Shield className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold capitalize">
                                            {organization.role?.replace(/_/g, " ") || "—"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">Peran Anda</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="mt-6 border-emerald-100/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">Informasi Organisasi</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Building2 className="size-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Nama Organisasi</p>
                                        <p className="text-sm font-medium">{organization.name}</p>
                                    </div>
                                </div>
                                {organization.description && (
                                    <div className="flex items-start gap-3">
                                        <FileText className="size-4 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Deskripsi</p>
                                            <p className="text-sm">{organization.description}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-start gap-3">
                                    <Clock className="size-4 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground">Status Verifikasi</p>
                                        <Badge
                                            variant={statusColors[organization.verification_status]}
                                            className="mt-0.5"
                                        >
                                            {statusLabels[organization.verification_status]}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="verification">
                        <div className="grid gap-6 lg:grid-cols-5">
                            <Card className="lg:col-span-3 border-emerald-100/50 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base">Status Verifikasi</CardTitle>
                                    <CardDescription>
                                        Lacak status verifikasi organisasi Anda
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <VerificationTimeline status={organization.verification_status} />
                                </CardContent>
                            </Card>

                            <Card className="lg:col-span-2 border-emerald-100/50 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-base">Upload Dokumen</CardTitle>
                                    <CardDescription>
                                        {organization.verification_status === "approved"
                                            ? "Organisasi sudah terverifikasi"
                                            : "Upload dokumen pendukung untuk verifikasi"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {organization.verification_status === "approved" ? (
                                        <div className="flex flex-col items-center gap-3 py-6 text-center">
                                            <div className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                <CheckCircle className="size-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                                                  Organisasi Terverifikasi
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                  Organisasi Anda telah diverifikasi dan dapat membuat event
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <DocumentUpload
                                                onUpload={(file) => uploadDoc.mutate(file)}
                                                isUploading={uploadDoc.isPending}
                                                uploadedFileName={organization.verification_document}
                                            />
                                            <div className="rounded-lg border bg-muted/30 p-3">
                                                <p className="text-xs font-medium flex items-center gap-1.5">
                                                    <FileText className="size-3.5" />
                                                    Format yang Didukung
                                                </p>
                                                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                                                    <li>PDF — Dokumen legal organisasi</li>
                                                    <li>JPG/PNG — Scan dokumen</li>
                                                    <li>Maksimal 5MB per file</li>
                                                </ul>
                                            </div>
                                            {uploadDoc.isSuccess && (
                                                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-400">
                                                    <CheckCircle className="size-4 shrink-0" />
                                                    Dokumen berhasil diunggah
                                                </div>
                                            )}
                                            {uploadDoc.isError && (
                                                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                                                    <XCircle className="size-4 shrink-0" />
                                                    Gagal mengunggah dokumen
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="documents">
                        <Card className="border-emerald-100/50 shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-base">Dokumen Organisasi</CardTitle>
                                <CardDescription>
                                    Dokumen verifikasi dan file organisasi
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {organization.verification_document ? (
                                    <div className="flex items-center gap-4 rounded-xl border bg-muted/30 p-4">
                                        <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            <FileText className="size-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium">Dokumen Verifikasi</p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {organization.verification_document}
                                            </p>
                                        </div>
                                        <Badge variant={statusColors[organization.verification_status]}>
                                            {statusLabels[organization.verification_status]}
                                        </Badge>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 py-10 text-center">
                                        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                                            <FileText className="size-6 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Belum Ada Dokumen</p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Upload dokumen verifikasi di tab Verifikasi
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="members">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">Anggota Organisasi</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {members?.length ?? 0} anggota terdaftar
                                    </p>
                                </div>
                                <Button
                                    variant="default"
                                    onClick={() => setShowAddMember(true)}
                                    className="gap-2"
                                >
                                    <UserPlus className="size-4" />
                                    Tambah Anggota
                                </Button>
                            </div>

                            {showAddMember && (
                                <Card className="border-emerald-100/50 shadow-sm">
                                    <CardContent className="pt-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium mb-1.5 block">ID Pengguna</label>
                                                <input
                                                    type="text"
                                                    value={newUserId}
                                                    onChange={(e) => setNewUserId(e.target.value)}
                                                    placeholder="Masukkan UUID pengguna"
                                                    className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium mb-1.5 block">Role</label>
                                                <select
                                                    value={newUserRole}
                                                    onChange={(e) => setNewUserRole(e.target.value as "Penyelenggara" | "Koordinator Event")}
                                                    className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                                >
                                                    <option value="Koordinator Event">Koordinator Event</option>
                                                    <option value="Penyelenggara">Penyelenggara</option>
                                                </select>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={handleAddMember}
                                                    disabled={!newUserId || addMember.isPending}
                                                    className="gap-2"
                                                >
                                                    {addMember.isPending ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
                                                    {addMember.isPending ? "Menambahkan..." : "Tambah"}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowAddMember(false)
                                                        setNewUserId("")
                                                        setNewUserRole("Koordinator Event")
                                                    }}
                                                >
                                                    Batal
                                                </Button>
                                            </div>
                                            {addMember.isError && (
                                                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/30 dark:bg-red-950/30 dark:text-red-400">
                                                    {(addMember.error as any)?.response?.data?.message || "Gagal menambahkan anggota"}
                                                </div>
                                            )}
                                            {addMember.isSuccess && (
                                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-950/30 dark:text-emerald-400">
                                                    Anggota berhasil ditambahkan
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {membersLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="size-6 animate-spin text-emerald-600" />
                                </div>
                            ) : members && members.length > 0 ? (
                                <div className="space-y-3">
                                    {members.map((member) => (
                                        <Card key={member.id} className="border-emerald-100/50 shadow-sm">
                                            <CardContent className="flex items-center justify-between py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                        {member.user.profile_photo_url ? (
                                                            <img
                                                                src={member.user.profile_photo_url}
                                                                alt={member.user.full_name}
                                                                className="size-full rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <Users className="size-5" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium">{member.user.full_name}</p>
                                                        <p className="text-xs text-muted-foreground">@{member.user.username}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {editingRole === member.user_id ? (
                                                        <div className="flex items-center gap-2">
                                                            <select
                                                                value={editRoleValue}
                                                                onChange={(e) => setEditRoleValue(e.target.value as "Penyelenggara" | "Koordinator Event")}
                                                                className="flex h-9 rounded-lg border border-border bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                                            >
                                                                <option value="Koordinator Event">Koordinator Event</option>
                                                                <option value="Penyelenggara">Penyelenggara</option>
                                                            </select>
                                                            <Button size="sm" onClick={() => handleUpdateRole(member.user_id, editRoleValue)}>
                                                                Simpan
                                                            </Button>
                                                            <Button size="sm" variant="outline" onClick={() => setEditingRole(null)}>
                                                                Batal
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <Badge variant={member.role === "Penyelenggara" ? "success" : "warning"}>
                                                                {member.role}
                                                            </Badge>
                                                            <Button
                                                                size="icon-xs"
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setEditingRole(member.user_id)
                                                                    setEditRoleValue(member.role as "Penyelenggara" | "Koordinator Event")
                                                                }}
                                                            >
                                                                <ChevronDown className="size-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button
                                                        size="icon-xs"
                                                        variant="ghost"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleRemoveMember(member.user_id, member.user.full_name)}
                                                        disabled={removeMember.isPending}
                                                    >
                                                        <UserMinus className="size-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3 py-12 text-center">
                                    <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                                        <Users className="size-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Belum Ada Anggota</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Tambahkan anggota untuk mulai berkolaborasi
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    )
}

export default function OrganizationDetailPage() {
    return (
        <AuthGuard>
            <OrganizationDetailContent />
        </AuthGuard>
    )
}

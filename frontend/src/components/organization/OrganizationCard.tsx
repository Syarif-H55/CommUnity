"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { TiltCard } from "./TiltCard"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, Calendar, ChevronRight } from "lucide-react"
import type { Organization } from "@/types"

interface OrganizationCardProps {
    organization: Organization
    className?: string
}

function OrganizationCard({ organization, className }: OrganizationCardProps) {
    const statusColors: Record<string, "warning" | "success" | "destructive"> = {
        pending: "warning",
        approved: "success",
        rejected: "destructive",
    }

    const statusLabels: Record<string, string> = {
        pending: "Menunggu",
        approved: "Terverifikasi",
        rejected: "Ditolak",
    }

    return (
        <TiltCard className={cn("group", className)} tiltDegree={6}>
            <Link href={`/organizations/${organization.id}`}>
                <div className="relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md hover:shadow-emerald-900/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />

                    <div className="relative p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-sm">
                                    {organization.logo_url ? (
                                        <img
                                            src={organization.logo_url}
                                            alt={organization.name}
                                            className="size-full rounded-xl object-cover"
                                        />
                                    ) : (
                                        <Building2 className="size-6" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-base truncate">
                                        {organization.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Bergabung {new Date(organization.created_at).toLocaleDateString("id-ID")}
                                    </p>
                                </div>
                            </div>

                            <Badge variant={statusColors[organization.verification_status] || "secondary"}>
                                {statusLabels[organization.verification_status] || organization.verification_status}
                            </Badge>
                        </div>

                        {organization.description && (
                            <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                                {organization.description}
                            </p>
                        )}

                        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                            {organization.member_count !== undefined && (
                                <span className="flex items-center gap-1.5">
                                    <Users className="size-3.5" />
                                    {organization.member_count} anggota
                                </span>
                            )}
                            {organization.event_count !== undefined && (
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="size-3.5" />
                                    {organization.event_count} event
                                </span>
                            )}
                            {organization.role && (
                                <span className="ml-auto text-emerald-600 dark:text-emerald-400 font-medium capitalize">
                                    {organization.role.replace(/_/g, " ")}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="absolute bottom-5 right-5 opacity-0 translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                        <ChevronRight className="size-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                </div>
            </Link>
        </TiltCard>
    )
}

export { OrganizationCard }

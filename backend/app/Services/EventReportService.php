<?php

namespace App\Services;

use App\Models\Event;
use App\Models\EventDocumentation;
use App\Models\EventReport;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class EventReportService
{
    public function __construct(
        private readonly CertificateService $certificateService
    ) {}

    public function createReport(Event $event, User $submitter, array $data): EventReport
    {
        if ($event->report()->exists()) {
            throw new RuntimeException('Laporan untuk event ini sudah ada.');
        }

        if (in_array($event->status, ['draft', 'cancelled'])) {
            throw new RuntimeException('Event tidak dalam status yang memperbolehkan pembuatan laporan.');
        }

        $report = EventReport::create([
            'id' => (string) Str::uuid(),
            'event_id' => $event->id,
            'submitted_by' => $submitter->id,
            'summary' => $data['summary'] ?? null,
            'total_attendees' => $data['total_attendees'] ?? null,
            'report_status' => 'draft',
        ]);

        if (!empty($data['photos'])) {
            $this->storePhotos($report, $data['photos']);
        }

        return $report->fresh()->load(['documentations', 'submitter', 'event']);
    }

    public function updateReport(EventReport $report, array $data): EventReport
    {
        if ($report->report_status !== 'draft' && $report->report_status !== 'revision_requested') {
            throw new RuntimeException('Laporan tidak dapat diubah pada status saat ini.');
        }

        $report->update([
            'summary' => $data['summary'] ?? $report->summary,
            'total_attendees' => $data['total_attendees'] ?? $report->total_attendees,
        ]);

        if (!empty($data['photos'])) {
            $this->storePhotos($report, $data['photos']);
        }

        return $report->fresh()->load(['documentations', 'submitter', 'event']);
    }

    public function uploadPhotos(EventReport $report, array $photos): EventReport
    {
        if ($report->report_status !== 'draft' && $report->report_status !== 'revision_requested') {
            throw new RuntimeException('Foto hanya dapat ditambahkan pada laporan draft atau revisi.');
        }

        $currentCount = $report->documentations()->count();
        $totalAfterUpload = $currentCount + count($photos);

        if ($totalAfterUpload > 5) {
            throw new RuntimeException('Maksimal 5 foto dokumentasi diperbolehkan.');
        }

        $this->storePhotos($report, $photos);

        return $report->fresh()->load(['documentations', 'submitter', 'event']);
    }

    public function deletePhoto(EventReport $report, EventDocumentation $photo): void
    {
        if ($report->report_status !== 'draft' && $report->report_status !== 'revision_requested') {
            throw new RuntimeException('Foto hanya dapat dihapus pada laporan draft atau revisi.');
        }

        if ($photo->report_id !== $report->id) {
            throw new RuntimeException('Foto tidak ditemukan pada laporan ini.');
        }

        Storage::disk('public')->delete($photo->image_path);
        $photo->delete();
    }

    public function submitReport(EventReport $report): EventReport
    {
        if ($report->report_status !== 'draft' && $report->report_status !== 'revision_requested') {
            throw new RuntimeException('Laporan sudah pernah dikirim.');
        }

        $photoCount = $report->documentations()->count();
        if ($photoCount < 1) {
            throw new RuntimeException('Minimal 1 foto dokumentasi wajib diunggah sebelum mengirim laporan.');
        }

        $report->update([
            'report_status' => 'submitted',
            'submitted_at' => now(),
        ]);

        return $report->fresh()->load(['documentations', 'submitter', 'event']);
    }

    public function reviewReport(EventReport $report, User $reviewer, string $action, ?string $rejectionReason = null): EventReport
    {
        if ($report->report_status !== 'submitted') {
            throw new RuntimeException('Laporan tidak dalam status yang dapat direview.');
        }

        if ($action === 'approved') {
            $report->update([
                'report_status' => 'approved',
                'approved_at' => now(),
            ]);

            $report->event->update(['status' => 'completed']);

            $this->certificateService->generateCertificates($report->event);

            return $report->fresh()->load(['documentations', 'submitter', 'event']);
        }

        if ($action === 'revision_requested') {
            if (empty($rejectionReason)) {
                throw new RuntimeException('Alasan revisi wajib diisi.');
            }

            $report->update([
                'report_status' => 'revision_requested',
                'rejection_reason' => $rejectionReason,
            ]);

            return $report->fresh()->load(['documentations', 'submitter', 'event']);
        }

        throw new RuntimeException('Aksi review tidak valid.');
    }

    public function getEventReport(Event $event): ?EventReport
    {
        return $event->report()->with(['documentations', 'submitter', 'event'])->first();
    }

    private function storePhotos(EventReport $report, array $photos): void
    {
        foreach ($photos as $photo) {
            if ($photo instanceof UploadedFile) {
                $path = $photo->store('event-documentations/' . $report->id, 'public');

                EventDocumentation::create([
                    'id' => (string) Str::uuid(),
                    'report_id' => $report->id,
                    'image_path' => $path,
                ]);
            }
        }
    }
}

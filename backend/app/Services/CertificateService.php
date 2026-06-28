<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Certificate;
use App\Models\Event;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class CertificateService
{
    public function generateCertificates(Event $event): void
    {
        $attendances = Attendance::where('event_id', $event->id)
            ->whereIn('status', ['present', 'late'])
            ->with('volunteer')
            ->get();

        foreach ($attendances as $attendance) {
            $existing = Certificate::where('volunteer_id', $attendance->volunteer_id)
                ->where('event_id', $event->id)
                ->exists();

            if ($existing) {
                continue;
            }

            $this->generateCertificate($event, $attendance->volunteer);
        }
    }

    public function generateCertificate(Event $event, User $volunteer): Certificate
    {
        $certificateNumber = $this->generateCertificateNumber();

        $certificate = Certificate::create([
            'id' => (string) Str::uuid(),
            'volunteer_id' => $volunteer->id,
            'event_id' => $event->id,
            'certificate_number' => $certificateNumber,
            'issued_at' => now(),
        ]);

        $pdfPath = $this->generatePdf($certificate);

        $certificate->update(['pdf_path' => $pdfPath]);

        return $certificate->fresh()->load(['volunteer', 'event']);
    }

    public function generatePdf(Certificate $certificate): string
    {
        $data = [
            'volunteerName' => $certificate->volunteer->full_name,
            'eventTitle' => $certificate->event->title,
            'eventDate' => $certificate->event->event_date->format('d F Y'),
            'eventLocation' => $certificate->event->city . ', ' . $certificate->event->province,
            'certificateNumber' => $certificate->certificate_number,
            'issuedAt' => $certificate->issued_at->format('d F Y'),
            'organizationName' => $certificate->event->organization->name,
        ];

        $pdf = Pdf::loadView('certificates.template', $data);
        $pdf->setPaper('A4', 'landscape');

        $filename = 'certificates/' . $certificate->certificate_number . '.pdf';
        Storage::disk('public')->put($filename, $pdf->output());

        return $filename;
    }

    private function generateCertificateNumber(): string
    {
        $prefix = 'CERT';
        $date = now()->format('Ymd');
        $random = strtoupper(Str::random(6));
        $number = $prefix . '-' . $date . '-' . $random;

        while (Certificate::where('certificate_number', $number)->exists()) {
            $random = strtoupper(Str::random(6));
            $number = $prefix . '-' . $date . '-' . $random;
        }

        return $number;
    }

    public function getUserCertificates(User $user, array $filters = [])
    {
        $query = Certificate::with(['event.organization', 'event.category'])
            ->where('volunteer_id', $user->id)
            ->orderBy('created_at', 'desc');

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function getEventCertificates(Event $event, array $filters = [])
    {
        $query = Certificate::with(['volunteer', 'event.organization'])
            ->where('event_id', $event->id)
            ->orderBy('created_at', 'desc');

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function getCertificate(string $id): ?Certificate
    {
        return Certificate::with(['volunteer', 'event.organization', 'event.category'])->find($id);
    }

    public function download(Certificate $certificate): string
    {
        if (!$certificate->pdf_path || !Storage::disk('public')->exists($certificate->pdf_path)) {
            throw new RuntimeException('File sertifikat tidak ditemukan.');
        }

        return Storage::disk('public')->path($certificate->pdf_path);
    }
}

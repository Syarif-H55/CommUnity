<?php

namespace App\Services;

use App\Models\AiReportUsageLog;
use App\Models\Event;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AiReportAssistantService
{
    private array $config;

    public function __construct()
    {
        $this->config = config('ai');
    }

    public function generateDraft(Event $event, User $user, ?string $additionalNotes = null): array
    {
        $startTime = microtime(true);

        $eventData = $this->buildEventData($event);
        $attendanceData = $this->buildAttendanceData($event);
        $prompt = $this->buildPrompt($eventData, $attendanceData, $additionalNotes);

        $provider = $this->config['provider'];

        try {
            if ($provider === 'openai') {
                $result = $this->callOpenAi($prompt);
            } else {
                $result = $this->callMock($eventData, $attendanceData, $additionalNotes);
            }

            $duration = (int) ((microtime(true) - $startTime) * 1000);

            $validated = $this->validateResponse($result['content']);

            $this->logUsage([
                'event_id' => $event->id,
                'user_id' => $user->id,
                'provider' => $provider,
                'model' => $result['model'] ?? ($provider === 'openai' ? $this->config['openai']['model'] : 'mock'),
                'prompt_tokens' => $result['prompt_tokens'] ?? null,
                'completion_tokens' => $result['completion_tokens'] ?? null,
                'total_tokens' => $result['total_tokens'] ?? null,
                'status' => 'success',
                'duration_ms' => $duration,
            ]);

            return [
                'success' => true,
                'data' => [
                    'summary' => $validated['summary'],
                    'sections' => $validated['sections'] ?? [],
                    'provider' => $provider,
                ],
            ];

        } catch (\Throwable $e) {
            $duration = (int) ((microtime(true) - $startTime) * 1000);

            $this->logUsage([
                'event_id' => $event->id,
                'user_id' => $user->id,
                'provider' => $provider,
                'model' => $provider === 'openai' ? $this->config['openai']['model'] : 'mock',
                'status' => 'error',
                'error_message' => $e->getMessage(),
                'duration_ms' => $duration,
            ]);

            Log::warning('AI Report generation failed', [
                'event_id' => $event->id,
                'provider' => $provider,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'data' => [
                    'summary' => $this->generateFallback($eventData, $attendanceData),
                    'sections' => [],
                    'provider' => 'fallback',
                ],
                'error' => 'Gagal menghasilkan draft AI. Menggunakan template bawaan.',
            ];
        }
    }

    private function buildEventData(Event $event): array
    {
        return [
            'title' => $event->title,
            'description' => $event->description ?? '-',
            'event_date' => $event->event_date ? $event->event_date->format('d F Y') : '-',
            'start_time' => $event->start_time ? date('H:i', strtotime($event->start_time)) : '-',
            'end_time' => $event->end_time ? date('H:i', strtotime($event->end_time)) : '-',
            'location' => implode(', ', array_filter([
                $event->location_name,
                $event->city,
                $event->province,
            ])),
            'category' => $event->category?->name ?? '-',
            'organization' => $event->organization?->name ?? '-',
            'coordinator' => $event->coordinator?->full_name ?? '-',
            'quota' => $event->quota,
        ];
    }

    private function buildAttendanceData(Event $event): array
    {
        $attendances = $event->attendances;

        $totalRegistered = $event->registrations()->count();
        $present = $attendances->where('status', 'present')->count();
        $late = $attendances->where('status', 'late')->count();
        $absent = $attendances->where('status', 'absent')->count();
        $totalAttended = $present + $late;
        $attendanceRate = $totalRegistered > 0
            ? round(($totalAttended / $totalRegistered) * 100, 1)
            : 0;

        return [
            'total_registered' => $totalRegistered,
            'present' => $present,
            'late' => $late,
            'absent' => $absent,
            'total_attended' => $totalAttended,
            'attendance_rate' => $attendanceRate,
        ];
    }

    private function buildPrompt(array $event, array $attendance, ?string $notes): string
    {
        $notesText = $notes
            ? "\n\n## Catatan Tambahan dari Koordinator\n{$notes}"
            : '';

        return <<<PROMPT
Buat draft laporan kegiatan sosial dalam Bahasa Indonesia yang profesional dan informatif berdasarkan data berikut:

## Informasi Kegiatan
- Nama Kegiatan: {$event['title']}
- Tanggal: {$event['event_date']}
- Waktu: {$event['start_time']} - {$event['end_time']}
- Lokasi: {$event['location']}
- Kategori: {$event['category']}
- Penyelenggara: {$event['organization']}
- Koordinator: {$event['coordinator']}
- Kuota: {$event['quota']}
- Deskripsi: {$event['description']}

## Data Kehadiran
- Total Pendaftar: {$attendance['total_registered']}
- Hadir: {$attendance['present']}
- Terlambat: {$attendance['late']}
- Tidak Hadir: {$attendance['absent']}
- Total Hadir: {$attendance['total_attended']}
- Tingkat Kehadiran: {$attendance['attendance_rate']}%
{$notesText}

Tulis dalam format berikut:

RINGKASAN KEGIATAN:
[Tulis 2-3 paragraf ringkasan kegiatan yang mencakup latar belakang, pelaksanaan, dan hasil kegiatan]

DATA KEHADIRAN:
[Analisis singkat data kehadiran]

DAMPAK KEGIATAN:
[Deskripsi dampak kegiatan terhadap masyarakat/lingkungan]
PROMPT;
    }

    private function callOpenAi(string $prompt): array
    {
        $apiKey = $this->config['openai']['api_key'];

        if (empty($apiKey)) {
            throw new \RuntimeException('OpenAI API key tidak dikonfigurasi.');
        }

        $model = $this->config['openai']['model'];
        $temperature = $this->config['openai']['temperature'];
        $maxTokens = $this->config['openai']['max_tokens'];
        $timeout = $this->config['openai']['timeout'];

        $payload = json_encode([
            'model' => $model,
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Anda adalah asisten pelaporan kegiatan sosial yang profesional. Selalu merespon dalam Bahasa Indonesia yang baik dan benar. Fokus pada fakta dan data yang diberikan.',
                ],
                [
                    'role' => 'user',
                    'content' => $prompt,
                ],
            ],
            'temperature' => $temperature,
            'max_tokens' => $maxTokens,
        ]);

        $ch = curl_init('https://api.openai.com/v1/chat/completions');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $payload,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $apiKey,
            ],
            CURLOPT_TIMEOUT => $timeout,
            CURLOPT_CONNECTTIMEOUT => 10,
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($curlError) {
            throw new \RuntimeException('Koneksi ke AI gagal: ' . $curlError);
        }

        if ($httpCode !== 200) {
            $errorBody = json_decode($response, true);
            $errorMsg = $errorBody['error']['message'] ?? 'HTTP ' . $httpCode;
            throw new \RuntimeException('AI API error: ' . $errorMsg);
        }

        $data = json_decode($response, true);

        if (!$data || !isset($data['choices'][0]['message']['content'])) {
            throw new \RuntimeException('Response AI tidak valid.');
        }

        return [
            'content' => $data['choices'][0]['message']['content'],
            'model' => $data['model'] ?? $model,
            'prompt_tokens' => $data['usage']['prompt_tokens'] ?? null,
            'completion_tokens' => $data['usage']['completion_tokens'] ?? null,
            'total_tokens' => $data['usage']['total_tokens'] ?? null,
        ];
    }

    private function callMock(array $event, array $attendance, ?string $notes): array
    {
        $delay = $this->config['mock']['delay_ms'] ?? 500;
        usleep($delay * 1000);

        if ($this->config['mock']['simulate_error'] ?? false) {
            throw new \RuntimeException('Simulasi error AI untuk testing.');
        }

        $summary = $this->generateMockSummary($event, $attendance);
        $impact = $this->generateMockImpact($event, $attendance);

        $content = "RINGKASAN KEGIATAN:\n{$summary}\n\nDATA KEHADIRAN:\n"
            . "Dari total {$attendance['total_registered']} pendaftar, {$attendance['total_attended']} orang hadir"
            . " ({$attendance['present']} tepat waktu, {$attendance['late']} terlambat)"
            . " dengan tingkat kehadiran {$attendance['attendance_rate']}%."
            . ($attendance['absent'] > 0 ? " {$attendance['absent']} orang tidak hadir." : "")
            . "\n\nDAMPAK KEGIATAN:\n{$impact}";

        return [
            'content' => $content,
            'model' => 'mock',
            'prompt_tokens' => null,
            'completion_tokens' => null,
            'total_tokens' => null,
        ];
    }

    private function generateMockSummary(array $event, array $attendance): string
    {
        $category = $event['category'];
        $location = $event['location'];
        $date = $event['event_date'];

        $templates = [
            "Kegiatan {$event['title']} telah berhasil dilaksanakan pada {$date} di {$location}. "
                . "Kegiatan ini merupakan program dari {$event['organization']} yang bertujuan untuk memberikan kontribusi positif bagi masyarakat. "
                . "Acara berlangsung dengan tertib dan lancar, dihadiri oleh {$attendance['total_attended']} peserta dari total {$attendance['total_registered']} pendaftar. "

                . "Dalam pelaksanaannya, peserta mengikuti serangkaian acara yang telah dipersiapkan dengan matang oleh panitia. "
                . "Kegiatan dimulai tepat waktu dan berjalan sesuai dengan rencana yang telah ditetapkan. "
                . "Antusiasme peserta terlihat dari partisipasi aktif selama kegiatan berlangsung. "

                . "Kegiatan {$event['title']} yang termasuk dalam kategori {$category} ini mendapatkan respons positif dari seluruh pihak yang terlibat. "
                . "Semoga kegiatan serupa dapat terus dilaksanakan di masa mendatang untuk memberikan manfaat yang lebih luas lagi bagi masyarakat.",
        ];

        return $templates[array_rand($templates)];
    }

    private function generateMockImpact(array $event, array $attendance): string
    {
        $category = $event['category'];
        $location = $event['location'];

        $impacts = [
            "Kegiatan ini memberikan dampak positif bagi masyarakat {$location}, khususnya dalam bidang {$category}. "
                . "Dengan partisipasi {$attendance['total_attended']} relawan, kegiatan ini berhasil mencapai tujuan yang telah ditetapkan. "
                . "Masyarakat setempat merasakan manfaat langsung dari kegiatan ini, dan diharapkan dapat menjadi inspirasi bagi kegiatan serupa di masa depan. "
                . "Kolaborasi antara {$event['organization']}, relawan, dan masyarakat menjadi kunci keberhasilan kegiatan ini.",
        ];

        return $impacts[array_rand($impacts)];
    }

    private function generateFallback(array $event, array $attendance): string
    {
        return "Laporan kegiatan {$event['title']} yang dilaksanakan pada {$event['event_date']} di {$event['location']}.\n\n"
            . "Kegiatan ini diselenggarakan oleh {$event['organization']} dengan kategori {$event['category']}.\n\n"
            . "Dari total {$attendance['total_registered']} pendaftar, {$attendance['total_attended']} orang hadir"
            . " ({$attendance['present']} tepat waktu, {$attendance['late']} terlambat).\n\n"
            . "Mohon lengkapi laporan ini dengan ringkasan kegiatan dan dokumentasi foto.";
    }

    private function validateResponse(string $content): array
    {
        $minLength = $this->config['validation']['min_summary_length'] ?? 50;
        $maxLength = $this->config['validation']['max_summary_length'] ?? 5000;

        $cleaned = trim($content);

        if (strlen($cleaned) < $minLength) {
            throw new \RuntimeException('Draft laporan terlalu pendek. Coba generate ulang.');
        }

        if (strlen($cleaned) > $maxLength) {
            $cleaned = mb_substr($cleaned, 0, $maxLength);
        }

        $sections = [];
        if (preg_match('/RINGKASAN KEGIATAN:(.*?)(?=DATA KEHADIRAN:|DAMPAK KEGIATAN:|$)/s', $cleaned, $m)) {
            $sections['summary'] = trim($m[1]);
        }
        if (preg_match('/DATA KEHADIRAN:(.*?)(?=DAMPAK KEGIATAN:|$)/s', $cleaned, $m)) {
            $sections['attendance'] = trim($m[1]);
        }
        if (preg_match('/DAMPAK KEGIATAN:(.*?)$/s', $cleaned, $m)) {
            $sections['impact'] = trim($m[1]);
        }

        return [
            'summary' => $cleaned,
            'sections' => $sections,
        ];
    }

    private function logUsage(array $data): void
    {
        try {
            AiReportUsageLog::create($data);
        } catch (\Throwable $e) {
            Log::error('Gagal menyimpan log usage AI', [
                'error' => $e->getMessage(),
                'data' => $data,
            ]);
        }
    }
}

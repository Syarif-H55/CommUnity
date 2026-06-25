<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Event;
use App\Models\User;
use App\Models\VolunteerRegistration;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use RuntimeException;

class AttendanceService
{
    public function generateQrData(Event $event): array
    {
        return [
            'event_id' => $event->id,
            'event_title' => $event->title,
            'qr_content' => json_encode([
                'event_id' => $event->id,
                't' => now()->timestamp,
            ]),
        ];
    }

    public function scanAttendance(Event $event, User $volunteer): Attendance
    {
        if ($event->status !== 'ongoing') {
            throw new RuntimeException('Attendance hanya dapat dilakukan pada event yang sedang berlangsung.');
        }

        $registered = VolunteerRegistration::where('event_id', $event->id)
            ->where('volunteer_id', $volunteer->id)
            ->exists();

        if (!$registered) {
            throw new RuntimeException('Anda tidak terdaftar pada event ini.');
        }

        $existing = Attendance::where('event_id', $event->id)
            ->where('volunteer_id', $volunteer->id)
            ->exists();

        if ($existing) {
            throw new RuntimeException('Anda sudah melakukan attendance pada event ini.');
        }

        $attendance = Attendance::create([
            'id' => (string) Str::uuid(),
            'event_id' => $event->id,
            'volunteer_id' => $volunteer->id,
            'status' => 'present',
            'attendance_time' => now(),
        ]);

        return $attendance->load(['volunteer']);
    }

    public function manualAttendance(Event $event, User $volunteer, string $status, User $validator): Attendance
    {
        if ($event->status !== 'ongoing' && $event->status !== 'published') {
            throw new RuntimeException('Event tidak dalam status yang memperbolehkan attendance.');
        }

        $registered = VolunteerRegistration::where('event_id', $event->id)
            ->where('volunteer_id', $volunteer->id)
            ->exists();

        if (!$registered) {
            throw new RuntimeException('Relawan tidak terdaftar pada event ini.');
        }

        $existing = Attendance::where('event_id', $event->id)
            ->where('volunteer_id', $volunteer->id)
            ->exists();

        if ($existing) {
            throw new RuntimeException('Attendance untuk relawan ini sudah tercatat.');
        }

        $attendance = Attendance::create([
            'id' => (string) Str::uuid(),
            'event_id' => $event->id,
            'volunteer_id' => $volunteer->id,
            'status' => $status,
            'attendance_time' => now(),
            'validated_by' => $validator->id,
        ]);

        return $attendance->load(['volunteer', 'validator']);
    }

    public function updateAttendance(Attendance $attendance, string $status, User $validator): Attendance
    {
        $attendance->update([
            'status' => $status,
            'validated_by' => $validator->id,
        ]);

        return $attendance->fresh()->load(['volunteer', 'validator']);
    }

    public function getEventAttendances(Event $event, array $filters = []): LengthAwarePaginator
    {
        $query = Attendance::with(['volunteer', 'validator'])
            ->where('event_id', $event->id)
            ->orderBy('created_at', 'desc');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function getUserAttendances(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = Attendance::with(['event.organization', 'event.category'])
            ->where('volunteer_id', $user->id)
            ->orderBy('created_at', 'desc');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function getAttendanceSummary(Event $event): array
    {
        $total = VolunteerRegistration::where('event_id', $event->id)->count();

        $present = Attendance::where('event_id', $event->id)
            ->whereIn('status', ['present', 'late'])
            ->count();

        $late = Attendance::where('event_id', $event->id)
            ->where('status', 'late')
            ->count();

        $absent = Attendance::where('event_id', $event->id)
            ->where('status', 'absent')
            ->count();

        return [
            'total_registered' => $total,
            'present' => $present,
            'late' => $late,
            'absent' => $absent,
            'attendance_rate' => $total > 0 ? round(($present / $total) * 100, 2) : 0,
        ];
    }
}

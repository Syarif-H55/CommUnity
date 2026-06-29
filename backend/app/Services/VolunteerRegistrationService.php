<?php

namespace App\Services;

use App\Models\Event;
use App\Models\User;
use App\Models\VolunteerRegistration;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use RuntimeException;

class VolunteerRegistrationService
{
    public function register(Event $event, User $volunteer): VolunteerRegistration
    {
        if ($event->status !== 'published') {
            throw new RuntimeException('Hanya event yang sudah dipublikasikan yang dapat diikuti.');
        }

        $existing = VolunteerRegistration::where('event_id', $event->id)
            ->where('volunteer_id', $volunteer->id)
            ->exists();

        if ($existing) {
            throw new RuntimeException('Anda sudah mendaftar pada event ini.');
        }

        $currentParticipants = VolunteerRegistration::where('event_id', $event->id)->count();
        if ($currentParticipants >= $event->quota) {
            throw new RuntimeException('Kuota peserta event sudah penuh.');
        }

        $registration = VolunteerRegistration::create([
            'id' => (string) Str::uuid(),
            'event_id' => $event->id,
            'volunteer_id' => $volunteer->id,
            'registered_at' => now(),
        ]);

        return $registration->load(['event.organization', 'event.category']);
    }

    public function getEventRegistrations(Event $event, array $filters = []): LengthAwarePaginator
    {
        return VolunteerRegistration::with(['volunteer'])
            ->where('event_id', $event->id)
            ->orderBy('created_at', 'desc')
            ->paginate($filters['per_page'] ?? 50);
    }

    public function getUserRegistrations(User $user, array $filters = []): LengthAwarePaginator
    {
        $query = VolunteerRegistration::with(['event.organization', 'event.category'])
            ->where('volunteer_id', $user->id)
            ->orderBy('created_at', 'desc');

        if (!empty($filters['status'])) {
            $query->whereHas('event', function ($q) use ($filters) {
                $q->where('status', $filters['status']);
            });
        }

        return $query->paginate($filters['per_page'] ?? 10);
    }
}

<?php

namespace App\Services;

use App\Models\Event;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use RuntimeException;

class EventService
{
    public function list(array $filters = []): LengthAwarePaginator
    {
        $query = Event::with(['organization', 'coordinator', 'category']);

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('description', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['city'])) {
            $query->where('city', 'like', '%' . $filters['city'] . '%');
        }

        if (!empty($filters['province'])) {
            $query->where('province', 'like', '%' . $filters['province'] . '%');
        }

        if (!empty($filters['date'])) {
            $query->where('event_date', $filters['date']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        $sortField = 'created_at';
        $sortDirection = 'desc';

        if (!empty($filters['sort'])) {
            if (str_starts_with($filters['sort'], '-')) {
                $sortDirection = 'desc';
                $sortField = substr($filters['sort'], 1);
            } else {
                $sortDirection = 'asc';
                $sortField = $filters['sort'];
            }

            $allowedSortFields = ['title', 'event_date', 'created_at', 'city', 'province', 'quota', 'status'];
            if (!in_array($sortField, $allowedSortFields)) {
                $sortField = 'created_at';
                $sortDirection = 'desc';
            }
        }

        $query->orderBy($sortField, $sortDirection);

        return $query->paginate($filters['per_page'] ?? 10);
    }

    public function getOrganizationEvents(Organization $organization, array $filters = []): Collection
    {
        return Event::with(['coordinator', 'category'])
            ->where('organization_id', $organization->id)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function create(array $data, Organization $organization, User $coordinator): Event
    {
        if ($organization->verification_status !== 'approved') {
            throw new RuntimeException('Organisasi belum terverifikasi.');
        }

        $event = Event::create([
            'organization_id' => $organization->id,
            'coordinator_id' => $coordinator->id,
            'category_id' => $data['category_id'],
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'province' => $data['province'] ?? null,
            'city' => $data['city'] ?? null,
            'location_name' => $data['location_name'] ?? null,
            'quota' => $data['quota'],
            'event_date' => $data['event_date'],
            'start_time' => $data['start_time'],
            'end_time' => $data['end_time'],
            'status' => 'draft',
        ]);

        return $event->load(['organization', 'coordinator', 'category']);
    }

    public function update(Event $event, array $data): Event
    {
        if ($event->status === 'completed') {
            throw new RuntimeException('Event yang sudah selesai tidak dapat diubah.');
        }

        $event->update($data);

        return $event->fresh()->load(['organization', 'coordinator', 'category']);
    }

    public function publish(Event $event): Event
    {
        if ($event->status !== 'draft') {
            throw new RuntimeException('Hanya event dengan status draft yang dapat dipublikasikan.');
        }

        if ($event->organization->verification_status !== 'approved') {
            throw new RuntimeException('Organisasi belum terverifikasi.');
        }

        $event->update([
            'status' => 'published',
        ]);

        return $event->fresh()->load(['organization', 'coordinator', 'category']);
    }

    public function find(string $id): ?Event
    {
        return Event::with(['organization', 'coordinator', 'category'])->find($id);
    }
}

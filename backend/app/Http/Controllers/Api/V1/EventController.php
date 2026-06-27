<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Event\StoreEventRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Http\Resources\EventResource;
use App\Models\Event;
use App\Models\Organization;
use App\Services\EventService;
use App\Traits\AuthorizesOrganizationAccess;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends BaseController
{
    use AuthorizesOrganizationAccess;

    public function __construct(
        private readonly EventService $eventService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['search', 'category_id', 'city', 'province', 'date', 'status', 'sort', 'per_page']);
        $events = $this->eventService->list($filters);

        return response()->json([
            'success' => true,
            'message' => 'Daftar event berhasil diambil.',
            'data' => EventResource::collection($events),
            'pagination' => [
                'current_page' => $events->currentPage(),
                'per_page' => $events->perPage(),
                'total' => $events->total(),
                'last_page' => $events->lastPage(),
            ],
        ]);
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        $organization = Organization::findOrFail($request->input('organization_id'));

        $this->authorizeOrganizerOf($organization);

        if ($organization->verification_status !== 'approved') {
            return $this->error('Organisasi belum terverifikasi.', 403);
        }

        try {
            $event = $this->eventService->create(
                $request->validated(),
                $organization,
                $request->user()
            );
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 403);
        }

        return $this->success(new EventResource($event), 'Event berhasil dibuat.', 201);
    }

    public function show(string $id): JsonResponse
    {
        $event = $this->eventService->find($id);

        if (!$event) {
            return $this->error('Event tidak ditemukan.', 404);
        }

        return $this->success(new EventResource($event), 'Detail event berhasil diambil.');
    }

    public function update(UpdateEventRequest $request, Event $event): JsonResponse
    {
        $this->authorizeEventAccess($event);

        try {
            $event = $this->eventService->update($event, $request->validated());
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 400);
        }

        return $this->success(new EventResource($event), 'Event berhasil diperbarui.');
    }

    public function destroy(Event $event): JsonResponse
    {
        if ($event->status === 'completed') {
            return $this->error('Event yang sudah selesai tidak dapat dihapus.', 400);
        }

        $this->authorizeOrganizerOf($event->organization);

        $event->delete();
        return $this->success(null, 'Event berhasil dihapus.');
    }

    public function publish(Request $request, Event $event): JsonResponse
    {
        $this->authorizeOrganizerOf($event->organization);

        try {
            $event = $this->eventService->publish($event);
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 400);
        }

        return $this->success(new EventResource($event), 'Event berhasil dipublikasikan.');
    }

    public function myEvents(Request $request): JsonResponse
    {
        $organizationIds = $request->user()->organizations()->pluck('organizations.id');

        if ($organizationIds->isEmpty()) {
            return $this->success([], 'Anda belum tergabung dalam organisasi mana pun.');
        }

        $events = $this->eventService->getOrganizationEventsByIds($organizationIds);

        return $this->success(
            EventResource::collection($events),
            'Daftar event organisasi berhasil diambil.'
        );
    }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\VolunteerRegistrationResource;
use App\Models\Event;
use App\Services\VolunteerRegistrationService;
use App\Traits\AuthorizesOrganizationAccess;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VolunteerRegistrationController extends BaseController
{
    use AuthorizesOrganizationAccess;

    public function __construct(
        private readonly VolunteerRegistrationService $registrationService
    ) {}

    public function register(Request $request, Event $event): JsonResponse
    {
        try {
            $registration = $this->registrationService->register($event, $request->user());
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 409);
        }

        return $this->success(
            new VolunteerRegistrationResource($registration),
            'Pendaftaran event berhasil.',
            201
        );
    }

    public function eventRegistrations(Request $request, Event $event): JsonResponse
    {
        $this->authorizeEventAccess($event);

        $filters = $request->only(['per_page']);
        $registrations = $this->registrationService->getEventRegistrations($event, $filters);

        return response()->json([
            'success' => true,
            'message' => 'Daftar pendaftar event berhasil diambil.',
            'data' => VolunteerRegistrationResource::collection($registrations),
            'pagination' => [
                'current_page' => $registrations->currentPage(),
                'per_page' => $registrations->perPage(),
                'total' => $registrations->total(),
                'last_page' => $registrations->lastPage(),
            ],
        ]);
    }

    public function myRegistrations(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'per_page']);
        $registrations = $this->registrationService->getUserRegistrations($request->user(), $filters);

        return response()->json([
            'success' => true,
            'message' => 'Riwayat partisipasi berhasil diambil.',
            'data' => VolunteerRegistrationResource::collection($registrations),
            'pagination' => [
                'current_page' => $registrations->currentPage(),
                'per_page' => $registrations->perPage(),
                'total' => $registrations->total(),
                'last_page' => $registrations->lastPage(),
            ],
        ]);
    }
}

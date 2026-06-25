<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Attendance\ManualAttendanceRequest;
use App\Http\Requests\Attendance\ScanAttendanceRequest;
use App\Http\Requests\Attendance\UpdateAttendanceRequest;
use App\Http\Resources\AttendanceResource;
use App\Models\Attendance;
use App\Models\Event;
use App\Services\AttendanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends BaseController
{
    public function __construct(
        private readonly AttendanceService $attendanceService
    ) {}

    public function generateQr(Event $event): JsonResponse
    {
        $this->authorizeEventAccess($event);

        $qrData = $this->attendanceService->generateQrData($event);

        return $this->success($qrData, 'QR attendance berhasil dibuat.');
    }

    public function scan(ScanAttendanceRequest $request, Event $event): JsonResponse
    {
        try {
            $attendance = $this->attendanceService->scanAttendance(
                $event,
                $request->user()
            );
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 400);
        }

        return $this->success(
            new AttendanceResource($attendance),
            'Attendance berhasil dicatat.',
            201
        );
    }

    public function manual(ManualAttendanceRequest $request, Event $event): JsonResponse
    {
        $this->authorizeEventAccess($event);

        $volunteer = \App\Models\User::find($request->input('volunteer_id'));

        if (!$volunteer) {
            return $this->error('Relawan tidak ditemukan.', 404);
        }

        try {
            $attendance = $this->attendanceService->manualAttendance(
                $event,
                $volunteer,
                $request->input('status'),
                $request->user()
            );
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 400);
        }

        return $this->success(
            new AttendanceResource($attendance),
            'Attendance berhasil dicatat.',
            201
        );
    }

    public function updateAttendanceStatus(
        UpdateAttendanceRequest $request,
        Event $event,
        Attendance $attendance
    ): JsonResponse {
        $this->authorizeEventAccess($event);

        if ($attendance->event_id !== $event->id) {
            return $this->error('Attendance tidak ditemukan pada event ini.', 404);
        }

        try {
            $attendance = $this->attendanceService->updateAttendance(
                $attendance,
                $request->input('status'),
                $request->user()
            );
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 400);
        }

        return $this->success(
            new AttendanceResource($attendance),
            'Status attendance berhasil diperbarui.'
        );
    }

    public function eventAttendances(Request $request, Event $event): JsonResponse
    {
        $this->authorizeEventAccess($event);

        $filters = $request->only(['status', 'per_page']);
        $attendances = $this->attendanceService->getEventAttendances($event, $filters);

        return response()->json([
            'success' => true,
            'message' => 'Daftar attendance berhasil diambil.',
            'data' => AttendanceResource::collection($attendances),
            'pagination' => [
                'current_page' => $attendances->currentPage(),
                'per_page' => $attendances->perPage(),
                'total' => $attendances->total(),
                'last_page' => $attendances->lastPage(),
            ],
        ]);
    }

    public function summary(Event $event): JsonResponse
    {
        $this->authorizeEventAccess($event);

        $summary = $this->attendanceService->getAttendanceSummary($event);

        return $this->success($summary, 'Ringkasan attendance berhasil diambil.');
    }

    public function myAttendances(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'per_page']);
        $attendances = $this->attendanceService->getUserAttendances($request->user(), $filters);

        return response()->json([
            'success' => true,
            'message' => 'Riwayat attendance berhasil diambil.',
            'data' => AttendanceResource::collection($attendances),
            'pagination' => [
                'current_page' => $attendances->currentPage(),
                'per_page' => $attendances->perPage(),
                'total' => $attendances->total(),
                'last_page' => $attendances->lastPage(),
            ],
        ]);
    }

    private function authorizeEventAccess(Event $event): void
    {
        $user = request()->user();

        $isOrganizer = $user->organizations()
            ->wherePivot('role', 'Penyelenggara')
            ->where('organization_id', $event->organization_id)
            ->exists();

        $isCoordinator = $user->organizations()
            ->wherePivot('role', 'Koordinator Event')
            ->where('organization_id', $event->organization_id)
            ->exists();

        if (!$isOrganizer && !$isCoordinator && !$user->is_admin) {
            abort(403, 'Anda tidak memiliki akses ke data attendance event ini.');
        }
    }
}

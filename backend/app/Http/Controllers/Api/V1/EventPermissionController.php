<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\OrganizationRole;
use App\Models\Event;
use Illuminate\Http\JsonResponse;

class EventPermissionController extends BaseController
{
    public function __invoke(Event $event): JsonResponse
    {
        $user = request()->user();

        $isOrganizer = $user->organizations()
            ->wherePivot('role', OrganizationRole::PENYELENGGARA)
            ->where('organization_id', $event->organization_id)
            ->exists();

        $isCoordinator = $user->organizations()
            ->wherePivot('role', OrganizationRole::KOORDINATOR_EVENT)
            ->where('organization_id', $event->organization_id)
            ->exists();

        $isAdmin = $user->is_admin ?? false;
        $isOrganizerOrCoordinator = $isOrganizer || $isCoordinator;

        return $this->success([
            'can_view' => $isOrganizerOrCoordinator || $isAdmin || $event->status === 'published',
            'can_edit' => ($isOrganizer || $isCoordinator) && $event->status !== 'completed',
            'can_delete' => $isOrganizer && $event->status !== 'completed',
            'can_publish' => $isOrganizer && $event->status === 'draft',
            'can_manage_attendance' => $isOrganizerOrCoordinator || $isAdmin,
            'can_submit_report' => $isOrganizerOrCoordinator,
            'can_review_report' => $isOrganizer || $isAdmin,
        ], 'Permission event berhasil diambil.');
    }
}

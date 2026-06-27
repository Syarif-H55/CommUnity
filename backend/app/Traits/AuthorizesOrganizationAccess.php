<?php

namespace App\Traits;

use App\Enums\OrganizationRole;
use App\Models\Event;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Exceptions\HttpResponseException;

trait AuthorizesOrganizationAccess
{
    protected function isOrganizerOf(User $user, Organization $organization): bool
    {
        return $user->organizations()
            ->wherePivot('role', OrganizationRole::PENYELENGGARA)
            ->where('organization_id', $organization->id)
            ->exists();
    }

    protected function isCoordinatorOf(User $user, Organization $organization): bool
    {
        return $user->organizations()
            ->wherePivot('role', OrganizationRole::KOORDINATOR_EVENT)
            ->where('organization_id', $organization->id)
            ->exists();
    }

    protected function isOrganizerOrCoordinatorOf(User $user, Organization $organization): bool
    {
        return $user->organizations()
            ->wherePivotIn('role', [OrganizationRole::PENYELENGGARA, OrganizationRole::KOORDINATOR_EVENT])
            ->where('organization_id', $organization->id)
            ->exists();
    }

    protected function authorizeOrganizerOf(Organization $organization): void
    {
        $user = request()->user();

        $isOrganizer = $this->isOrganizerOf($user, $organization);

        if (!$isOrganizer && !$user->is_admin) {
            throw new HttpResponseException(
                response()->json([
                    'success' => false,
                    'message' => 'Hanya penyelenggara organisasi yang dapat melakukan tindakan ini.',
                ], 403)
            );
        }
    }

    protected function authorizeOrganizerOrCoordinatorOf(Organization $organization): void
    {
        $user = request()->user();

        $hasAccess = $this->isOrganizerOrCoordinatorOf($user, $organization);

        if (!$hasAccess && !$user->is_admin) {
            throw new HttpResponseException(
                response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki akses ke organisasi ini.',
                ], 403)
            );
        }
    }

    protected function authorizeEventAccess(Event $event): void
    {
        $user = request()->user();

        $hasAccess = $user->organizations()
            ->wherePivotIn('role', [OrganizationRole::PENYELENGGARA, OrganizationRole::KOORDINATOR_EVENT])
            ->where('organization_id', $event->organization_id)
            ->exists();

        if (!$hasAccess && !$user->is_admin) {
            throw new HttpResponseException(
                response()->json([
                    'success' => false,
                    'message' => 'Anda tidak memiliki akses ke event ini.',
                ], 403)
            );
        }
    }

    protected function authorizeCoordinatorOrOrganizer(Event $event): void
    {
        $user = request()->user();

        $hasAccess = $user->organizations()
            ->wherePivotIn('role', [OrganizationRole::PENYELENGGARA, OrganizationRole::KOORDINATOR_EVENT])
            ->where('organization_id', $event->organization_id)
            ->exists();

        if (!$hasAccess) {
            throw new HttpResponseException(
                response()->json([
                    'success' => false,
                    'message' => 'Hanya penyelenggara dan koordinator event yang dapat mengelola laporan.',
                ], 403)
            );
        }
    }

    protected function authorizeOrganizer(Event $event): void
    {
        $user = request()->user();

        $isOrganizer = $this->isOrganizerOf($user, $event->organization);

        if (!$isOrganizer && !$user->is_admin) {
            throw new HttpResponseException(
                response()->json([
                    'success' => false,
                    'message' => 'Hanya penyelenggara yang dapat mereview laporan.',
                ], 403)
            );
        }
    }
}

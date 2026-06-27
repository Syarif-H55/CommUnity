<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Event;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AdminStatsController extends BaseController
{
    public function __invoke(): JsonResponse
    {
        $totalOrganizations = Organization::count();
        $totalEvents = Event::count();
        $totalUsers = User::count();
        $pendingVerification = Organization::where('verification_status', 'pending')->count();

        return $this->success([
            'total_organizations' => $totalOrganizations,
            'total_events' => $totalEvents,
            'total_users' => $totalUsers,
            'pending_verification' => $pendingVerification,
            'recent_events' => Event::with('organization')
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($event) => [
                    'id' => $event->id,
                    'title' => $event->title,
                    'status' => $event->status,
                    'start_time' => $event->start_time,
                    'organization_name' => $event->organization->name ?? null,
                    'created_at' => $event->created_at,
                ]),
            'recent_users' => User::latest()
                ->take(5)
                ->get()
                ->map(fn($user) => [
                    'id' => $user->id,
                    'full_name' => $user->full_name,
                    'username' => $user->username,
                    'email' => $user->email,
                    'is_admin' => $user->is_admin ?? false,
                    'created_at' => $user->created_at,
                ]),
        ], 'Statistik dashboard berhasil diambil.');
    }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Enums\OrganizationRole;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserContextController extends BaseController
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        $organizations = $user->organizations()
            ->select('organizations.id', 'organizations.name')
            ->withPivot('role')
            ->get()
            ->map(fn($org) => [
                'id' => $org->id,
                'name' => $org->name,
                'role' => $org->pivot->role,
            ]);

        return $this->success([
            'is_admin' => $user->is_admin ?? false,
            'organizations' => $organizations,
            'is_organizer' => $organizations->contains('role', OrganizationRole::PENYELENGGARA),
            'is_coordinator' => $organizations->contains('role', OrganizationRole::KOORDINATOR_EVENT),
        ], 'Role context berhasil diambil.');
    }
}

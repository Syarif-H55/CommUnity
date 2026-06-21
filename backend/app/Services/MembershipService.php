<?php

namespace App\Services;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;
use RuntimeException;

class MembershipService
{
    /**
     * List all members of an organization.
     */
    public function listMembers(Organization $organization): Collection
    {
        return $organization->members()
            ->withPivot('id', 'role', 'joined_at')
            ->get();
    }

    /**
     * Add a user as a member of an organization.
     */
    public function addMember(Organization $organization, User $user, string $role): User
    {
        if ($organization->members()->where('user_id', $user->id)->exists()) {
            throw new RuntimeException('Pengguna sudah menjadi anggota organisasi ini.');
        }

        $validRoles = ['Penyelenggara', 'Koordinator Event'];
        if (!in_array($role, $validRoles)) {
            throw new RuntimeException('Role yang dipilih tidak valid.');
        }

        $organization->members()->attach($user->id, [
            'id' => (string) Str::uuid(),
            'role' => $role,
            'joined_at' => now(),
        ]);

        return $organization->members()
            ->withPivot('id', 'role', 'joined_at')
            ->where('user_id', $user->id)
            ->first();
    }

    /**
     * Remove a member from an organization.
     */
    public function removeMember(Organization $organization, User $user): void
    {
        $membership = $organization->members()
            ->where('user_id', $user->id)
            ->first();

        if (!$membership) {
            throw new RuntimeException('Pengguna bukan anggota organisasi ini.');
        }

        $organization->members()->detach($user->id);
    }

    /**
     * Assign a new role to a member.
     */
    public function assignRole(Organization $organization, User $user, string $role): User
    {
        $validRoles = ['Penyelenggara', 'Koordinator Event'];
        if (!in_array($role, $validRoles)) {
            throw new RuntimeException('Role yang dipilih tidak valid.');
        }

        $membership = $organization->members()
            ->where('user_id', $user->id)
            ->first();

        if (!$membership) {
            throw new RuntimeException('Pengguna bukan anggota organisasi ini.');
        }

        $organization->members()->updateExistingPivot($user->id, [
            'role' => $role,
        ]);

        return $organization->members()
            ->withPivot('id', 'role', 'joined_at')
            ->where('user_id', $user->id)
            ->first();
    }
}

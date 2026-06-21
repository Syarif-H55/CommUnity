<?php

namespace App\Services;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class OrganizationService
{
    /**
     * Register a new organization and add creator as Penyelenggara.
     */
    public function register(array $data, User $user): Organization
    {
        $organization = Organization::create([
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'organization_email' => $data['organization_email'] ?? null,
            'verification_status' => 'pending',
        ]);

        $organization->members()->attach($user->id, [
            'id' => (string) Str::uuid(),
            'role' => 'Penyelenggara',
            'joined_at' => now(),
        ]);

        return $organization;
    }

    /**
     * Update organization details.
     */
    public function update(Organization $organization, array $data): Organization
    {
        $organization->update($data);

        return $organization->fresh();
    }

    /**
     * Upload verification document for organization.
     */
    public function uploadDocument(Organization $organization, UploadedFile $file): Organization
    {
        $path = $file->store('verification-documents', 'public');

        $organization->update([
            'verification_document' => $path,
        ]);

        return $organization->fresh();
    }

    /**
     * Verify or reject organization.
     */
    public function verify(Organization $organization, string $status, ?string $reason = null): Organization
    {
        $organization->update([
            'verification_status' => $status,
            'rejection_reason' => $status === 'rejected' ? $reason : null,
            'verified_at' => $status === 'approved' ? now() : null,
        ]);

        return $organization->fresh();
    }
}

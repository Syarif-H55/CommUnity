<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Organization\StoreMemberRequest;
use App\Http\Requests\Organization\UpdateMemberRoleRequest;
use App\Http\Resources\MemberResource;
use App\Models\Organization;
use App\Models\User;
use App\Services\MembershipService;
use Illuminate\Http\JsonResponse;

class OrganizationMemberController extends BaseController
{
    public function __construct(
        private readonly MembershipService $membershipService
    ) {}

    /**
     * Display a listing of organization members.
     */
    public function index(Organization $organization): JsonResponse
    {
        $members = $this->membershipService->listMembers($organization);

        return $this->success(
            MemberResource::collection($members),
            'Daftar anggota berhasil diambil.'
        );
    }

    /**
     * Add a new member to the organization.
     */
    public function store(StoreMemberRequest $request, Organization $organization): JsonResponse
    {
        $user = User::findOrFail($request->user_id);

        try {
            $member = $this->membershipService->addMember($organization, $user, $request->role);
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 409);
        }

        return $this->success(
            new MemberResource($member),
            'Anggota berhasil ditambahkan.',
            201
        );
    }

    /**
     * Update member role.
     */
    public function update(UpdateMemberRoleRequest $request, Organization $organization, User $member): JsonResponse
    {
        try {
            $updatedMember = $this->membershipService->assignRole($organization, $member, $request->role);
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 404);
        }

        return $this->success(
            new MemberResource($updatedMember),
            'Peran anggota berhasil diperbarui.'
        );
    }

    /**
     * Remove a member from the organization.
     */
    public function destroy(Organization $organization, User $member): JsonResponse
    {
        try {
            $this->membershipService->removeMember($organization, $member);
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 404);
        }

        return $this->success(null, 'Anggota berhasil dihapus.');
    }
}

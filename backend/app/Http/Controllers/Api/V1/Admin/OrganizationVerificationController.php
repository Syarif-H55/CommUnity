<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Requests\Admin\VerifyOrganizationRequest;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;
use App\Services\OrganizationService;
use Illuminate\Http\JsonResponse;

class OrganizationVerificationController extends BaseController
{
    public function __construct(
        private readonly OrganizationService $organizationService
    ) {}

    /**
     * Verify or reject an organization.
     */
    public function verify(VerifyOrganizationRequest $request, Organization $organization): JsonResponse
    {
        $organization = $this->organizationService->verify(
            $organization,
            $request->validated()['status'],
            $request->validated()['rejection_reason'] ?? null
        );

        $message = $request->status === 'approved'
            ? 'Organisasi berhasil diverifikasi.'
            : 'Organisasi ditolak.';

        return $this->success(
            new OrganizationResource($organization),
            $message
        );
    }
}

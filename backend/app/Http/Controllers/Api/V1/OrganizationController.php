<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Organization\StoreOrganizationRequest;
use App\Http\Requests\Organization\UpdateOrganizationRequest;
use App\Http\Requests\Organization\UploadDocumentRequest;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;
use App\Services\OrganizationService;
use App\Traits\AuthorizesOrganizationAccess;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizationController extends BaseController
{
    use AuthorizesOrganizationAccess;

    public function __construct(
        private readonly OrganizationService $organizationService
    ) {}

    /**
     * Display a listing of organizations.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Organization::withCount('members');

        if (!$request->user()->is_admin) {
            $query->where('verification_status', 'approved');
        }

        $organizations = $query->paginate($request->input('per_page', 10));

        return response()->json([
            'success' => true,
            'message' => 'Daftar organisasi berhasil diambil.',
            'data' => OrganizationResource::collection($organizations),
            'pagination' => [
                'current_page' => $organizations->currentPage(),
                'per_page' => $organizations->perPage(),
                'total' => $organizations->total(),
                'last_page' => $organizations->lastPage(),
            ],
        ]);
    }

    /**
     * Register a new organization.
     */
    public function store(StoreOrganizationRequest $request): JsonResponse
    {
        $organization = $this->organizationService->register(
            $request->validated(),
            $request->user()
        );

        return $this->success(
            new OrganizationResource($organization),
            'Organisasi berhasil didaftarkan.',
            201
        );
    }

    /**
     * Display the specified organization.
     */
    public function show(Organization $organization): JsonResponse
    {
        $organization->loadCount('members');

        return $this->success(
            new OrganizationResource($organization),
            'Detail organisasi berhasil diambil.'
        );
    }

    /**
     * Update the specified organization.
     */
    public function update(UpdateOrganizationRequest $request, Organization $organization): JsonResponse
    {
        $this->authorizeOrganizerOf($organization);

        $organization = $this->organizationService->update(
            $organization,
            $request->validated()
        );

        return $this->success(
            new OrganizationResource($organization),
            'Organisasi berhasil diperbarui.'
        );
    }

    /**
     * Remove the specified organization (soft delete).
     */
    public function destroy(Organization $organization): JsonResponse
    {
        $this->authorizeOrganizerOf($organization);

        $organization->delete();

        return $this->success(null, 'Organisasi berhasil dihapus.');
    }

    /**
     * Upload verification document for organization.
     */
    public function uploadDocument(UploadDocumentRequest $request, Organization $organization): JsonResponse
    {
        $this->authorizeOrganizerOf($organization);

        $organization = $this->organizationService->uploadDocument(
            $organization,
            $request->file('document')
        );

        return $this->success(
            new OrganizationResource($organization),
            'Dokumen verifikasi berhasil diunggah.'
        );
    }
}

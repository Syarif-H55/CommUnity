<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Resources\OrganizationResource;
use App\Models\Organization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminOrganizationController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $query = Organization::withCount('members');

        if ($request->filled('status')) {
            $query->where('verification_status', $request->status);
        }

        $organizations = $query->latest()->paginate($request->per_page ?? 10);

        return OrganizationResource::collection($organizations)
            ->additional([
                'success' => true,
                'message' => 'Daftar organisasi berhasil diambil.',
            ])
            ->response();
    }
}

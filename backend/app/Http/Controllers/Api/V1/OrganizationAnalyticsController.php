<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Organization;
use App\Services\AnalyticsService;
use App\Traits\AuthorizesOrganizationAccess;
use Illuminate\Http\JsonResponse;

class OrganizationAnalyticsController extends BaseController
{
    use AuthorizesOrganizationAccess;

    public function __construct(
        private readonly AnalyticsService $analyticsService
    ) {}

    public function __invoke(Organization $organization): JsonResponse
    {
        $this->authorizeOrganizerOrCoordinatorOf($organization);

        $analytics = $this->analyticsService->getOrganizationAnalytics($organization);

        return $this->success($analytics, 'Data analytics berhasil diambil.');
    }
}

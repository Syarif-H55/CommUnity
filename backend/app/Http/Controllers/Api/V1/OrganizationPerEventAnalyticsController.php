<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Organization;
use App\Services\AnalyticsService;
use App\Traits\AuthorizesOrganizationAccess;
use Illuminate\Http\JsonResponse;

class OrganizationPerEventAnalyticsController extends BaseController
{
    use AuthorizesOrganizationAccess;

    public function __construct(
        private readonly AnalyticsService $analyticsService
    ) {}

    public function __invoke(Organization $organization): JsonResponse
    {
        $this->authorizeOrganizerOrCoordinatorOf($organization);

        $events = $this->analyticsService->getPerEventAnalytics($organization);

        return $this->success($events, 'Data per-event analytics berhasil diambil.');
    }
}

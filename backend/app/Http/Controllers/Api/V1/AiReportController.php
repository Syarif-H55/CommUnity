<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Requests\Report\AiGenerateReportRequest;
use App\Models\Event;
use App\Services\AiReportAssistantService;
use App\Traits\AuthorizesOrganizationAccess;
use Illuminate\Http\JsonResponse;

class AiReportController extends BaseController
{
    use AuthorizesOrganizationAccess;

    public function __construct(
        private AiReportAssistantService $aiReportService
    ) {}

    public function generate(AiGenerateReportRequest $request, Event $event): JsonResponse
    {
        $user = $request->user();

        $this->authorizeCoordinatorOrOrganizer($event->organization, $user);

        $additionalNotes = $request->input('additional_notes');

        $result = $this->aiReportService->generateDraft($event, $user, $additionalNotes);

        if ($result['success']) {
            return $this->success(
                data: [
                    'summary' => $result['data']['summary'],
                    'sections' => $result['data']['sections'],
                    'provider' => $result['data']['provider'],
                ],
                message: 'Draft laporan berhasil dihasilkan.',
            );
        }

        return $this->success(
            data: [
                'summary' => $result['data']['summary'],
                'sections' => $result['data']['sections'],
                'provider' => $result['data']['provider'],
            ],
            message: $result['error'] ?? 'Draft laporan menggunakan template bawaan.',
            code: 200,
        );
    }
}

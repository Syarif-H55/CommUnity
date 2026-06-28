<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\CertificateResource;
use App\Models\Certificate;
use App\Models\Event;
use App\Services\CertificateService;
use App\Traits\AuthorizesOrganizationAccess;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CertificateController extends BaseController
{
    use AuthorizesOrganizationAccess;

    public function __construct(
        private readonly CertificateService $certificateService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $certificates = $this->certificateService->getUserCertificates(
            $request->user(),
            $request->only(['per_page'])
        );

        return response()->json([
            'success' => true,
            'message' => 'Daftar sertifikat berhasil diambil.',
            'data' => CertificateResource::collection($certificates),
            'pagination' => [
                'current_page' => $certificates->currentPage(),
                'per_page' => $certificates->perPage(),
                'total' => $certificates->total(),
                'last_page' => $certificates->lastPage(),
            ],
        ]);
    }

    public function show(Certificate $certificate): JsonResponse
    {
        $user = request()->user();

        if ($certificate->volunteer_id !== $user->id && !$user->is_admin) {
            return $this->error('Anda tidak memiliki akses ke sertifikat ini.', 403);
        }

        $certificate->load(['volunteer', 'event.organization', 'event.category']);

        return $this->success(
            new CertificateResource($certificate),
            'Detail sertifikat berhasil diambil.'
        );
    }

    public function download(Certificate $certificate): JsonResponse
    {
        $user = request()->user();

        if ($certificate->volunteer_id !== $user->id && !$user->is_admin) {
            return $this->error('Anda tidak memiliki akses ke sertifikat ini.', 403);
        }

        try {
            $filePath = $this->certificateService->download($certificate);
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 404);
        }

        $filename = 'sertifikat-' . $certificate->certificate_number . '.pdf';

        return response()->download($filePath, $filename, [
            'Content-Type' => 'application/pdf',
        ]);
    }

    public function eventCertificates(Request $request, Event $event): JsonResponse
    {
        $this->authorizeEventAccess($event);

        $certificates = $this->certificateService->getEventCertificates(
            $event,
            $request->only(['per_page'])
        );

        return response()->json([
            'success' => true,
            'message' => 'Daftar sertifikat event berhasil diambil.',
            'data' => CertificateResource::collection($certificates),
            'pagination' => [
                'current_page' => $certificates->currentPage(),
                'per_page' => $certificates->perPage(),
                'total' => $certificates->total(),
                'last_page' => $certificates->lastPage(),
            ],
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Report\ReviewEventReportRequest;
use App\Http\Requests\Report\StoreEventReportRequest;
use App\Http\Requests\Report\UploadReportPhotosRequest;
use App\Http\Resources\EventReportResource;
use App\Models\Event;
use App\Models\EventDocumentation;
use App\Services\EventReportService;
use App\Traits\AuthorizesOrganizationAccess;
use Illuminate\Http\JsonResponse;

class EventReportController extends BaseController
{
    use AuthorizesOrganizationAccess;

    public function __construct(
        private readonly EventReportService $eventReportService
    ) {}

    public function show(Event $event): JsonResponse
    {
        $this->authorizeEventAccess($event);

        $report = $this->eventReportService->getEventReport($event);

        if (!$report) {
            return $this->success(null, 'Belum ada laporan untuk event ini.');
        }

        return $this->success(
            new EventReportResource($report),
            'Laporan berhasil diambil.'
        );
    }

    public function store(StoreEventReportRequest $request, Event $event): JsonResponse
    {
        $this->authorizeCoordinatorOrOrganizer($event);

        try {
            $report = $this->eventReportService->createReport(
                $event,
                $request->user(),
                $request->validated()
            );
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 400);
        }

        return $this->success(
            new EventReportResource($report),
            'Laporan berhasil dibuat.',
            201
        );
    }

    public function update(StoreEventReportRequest $request, Event $event): JsonResponse
    {
        $this->authorizeCoordinatorOrOrganizer($event);

        $report = $event->report;

        if (!$report) {
            return $this->error('Laporan tidak ditemukan.', 404);
        }

        try {
            $report = $this->eventReportService->updateReport(
                $report,
                $request->validated()
            );
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 400);
        }

        return $this->success(
            new EventReportResource($report),
            'Laporan berhasil diperbarui.'
        );
    }

    public function uploadPhotos(UploadReportPhotosRequest $request, Event $event): JsonResponse
    {
        $this->authorizeCoordinatorOrOrganizer($event);

        $report = $event->report;

        if (!$report) {
            return $this->error('Laporan tidak ditemukan.', 404);
        }

        try {
            $report = $this->eventReportService->uploadPhotos(
                $report,
                $request->file('photos')
            );
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 400);
        }

        return $this->success(
            new EventReportResource($report),
            'Foto berhasil diunggah.'
        );
    }

    public function deletePhoto(Event $event, EventDocumentation $photo): JsonResponse
    {
        $this->authorizeCoordinatorOrOrganizer($event);

        $report = $event->report;

        if (!$report) {
            return $this->error('Laporan tidak ditemukan.', 404);
        }

        try {
            $this->eventReportService->deletePhoto($report, $photo);
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 400);
        }

        return $this->success(null, 'Foto berhasil dihapus.');
    }

    public function submit(Event $event): JsonResponse
    {
        $this->authorizeCoordinatorOrOrganizer($event);

        $report = $event->report;

        if (!$report) {
            return $this->error('Laporan tidak ditemukan.', 404);
        }

        try {
            $report = $this->eventReportService->submitReport($report);
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 400);
        }

        return $this->success(
            new EventReportResource($report),
            'Laporan berhasil dikirim.'
        );
    }

    public function review(ReviewEventReportRequest $request, Event $event): JsonResponse
    {
        $this->authorizeOrganizer($event);

        $report = $event->report;

        if (!$report) {
            return $this->error('Laporan tidak ditemukan.', 404);
        }

        try {
            $report = $this->eventReportService->reviewReport(
                $report,
                $request->user(),
                $request->input('action'),
                $request->input('rejection_reason')
            );
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), 400);
        }

        $message = $request->input('action') === 'approved'
            ? 'Laporan berhasil disetujui.'
            : 'Revisi laporan berhasil diminta.';

        return $this->success(
            new EventReportResource($report),
            $message
        );
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event_id' => $this->event_id,
            'event_title' => $this->whenLoaded('event', fn() => $this->event->title),
            'submitted_by' => $this->submitted_by,
            'submitter_name' => $this->whenLoaded('submitter', fn() => $this->submitter->full_name),
            'summary' => $this->summary,
            'total_attendees' => $this->total_attendees,
            'report_status' => $this->report_status,
            'rejection_reason' => $this->rejection_reason,
            'photos' => EventDocumentationResource::collection($this->whenLoaded('documentations')),
            'submitted_at' => $this->submitted_at?->toISOString(),
            'approved_at' => $this->approved_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}

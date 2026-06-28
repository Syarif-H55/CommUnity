<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CertificateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'volunteer_id' => $this->volunteer_id,
            'volunteer_name' => $this->whenLoaded('volunteer', fn() => $this->volunteer->full_name),
            'event_id' => $this->event_id,
            'event_title' => $this->whenLoaded('event', fn() => $this->event->title),
            'event_date' => $this->whenLoaded('event', fn() => $this->event->event_date->format('Y-m-d')),
            'organization_name' => $this->whenLoaded('event', fn() => $this->event?->organization?->name),
            'certificate_number' => $this->certificate_number,
            'pdf_url' => $this->pdf_path ? asset('storage/' . $this->pdf_path) : null,
            'issued_at' => $this->issued_at?->toISOString(),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}

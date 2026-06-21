<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'organization_id' => $this->organization_id,
            'organization_name' => $this->whenLoaded('organization', fn() => $this->organization->name),
            'coordinator_id' => $this->coordinator_id,
            'coordinator_name' => $this->whenLoaded('coordinator', fn() => $this->coordinator->full_name),
            'category_id' => $this->category_id,
            'category_name' => $this->whenLoaded('category', fn() => $this->category->name),
            'title' => $this->title,
            'description' => $this->description,
            'province' => $this->province,
            'city' => $this->city,
            'location_name' => $this->location_name,
            'quota' => $this->quota,
            'event_date' => $this->event_date,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

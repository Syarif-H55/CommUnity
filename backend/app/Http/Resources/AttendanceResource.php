<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event_id' => $this->event_id,
            'volunteer_id' => $this->volunteer_id,
            'volunteer_name' => $this->whenLoaded('volunteer', fn() => $this->volunteer->full_name),
            'volunteer_username' => $this->whenLoaded('volunteer', fn() => $this->volunteer->username),
            'status' => $this->status,
            'attendance_time' => $this->attendance_time?->toISOString(),
            'validated_by' => $this->validated_by,
            'validator_name' => $this->whenLoaded('validator', fn() => $this->validator?->full_name),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}

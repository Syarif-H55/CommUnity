<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VolunteerRegistrationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'event_id' => $this->event_id,
            'volunteer_id' => $this->volunteer_id,
            'event' => new EventResource($this->whenLoaded('event')),
            'registered_at' => $this->registered_at,
            'created_at' => $this->created_at,
        ];
    }
}

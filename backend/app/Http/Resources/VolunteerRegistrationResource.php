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
            'volunteer' => $this->whenLoaded('volunteer', fn() => [
                'id' => $this->volunteer->id,
                'full_name' => $this->volunteer->full_name,
                'username' => $this->volunteer->username,
                'profile_photo_url' => $this->volunteer->profile_photo_url,
            ]),
            'event' => new EventResource($this->whenLoaded('event')),
            'registered_at' => $this->registered_at,
            'created_at' => $this->created_at,
        ];
    }
}

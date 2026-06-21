<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MemberResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->pivot->id,
            'organization_id' => $this->pivot->organization_id,
            'user_id' => $this->id,
            'user' => [
                'id' => $this->id,
                'full_name' => $this->full_name,
                'username' => $this->username,
                'profile_photo_url' => $this->profile_photo_path
                    ? asset('storage/' . $this->profile_photo_path)
                    : null,
            ],
            'role' => $this->pivot->role,
            'joined_at' => $this->pivot->joined_at,
        ];
    }
}

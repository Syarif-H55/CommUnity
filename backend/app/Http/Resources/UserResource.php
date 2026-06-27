<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'full_name' => $this->full_name,
            'username' => $this->username,
            'email' => $this->email,
            'is_admin' => $this->is_admin ?? false,
            'profile_photo_url' => $this->profile_photo_path
                ? asset('storage/' . $this->profile_photo_path)
                : null,
            'created_at' => $this->created_at,
        ];
    }
}

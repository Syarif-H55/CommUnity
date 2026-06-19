<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganizationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'organization_email' => $this->organization_email,
            'description' => $this->description,
            'logo' => $this->logo ? asset('storage/' . $this->logo) : null,
            'verification_document' => $this->verification_document,
            'verification_status' => $this->verification_status,
            'rejection_reason' => $this->rejection_reason,
            'verified_at' => $this->verified_at,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'members_count' => $this->whenCounted('members'),
        ];
    }
}

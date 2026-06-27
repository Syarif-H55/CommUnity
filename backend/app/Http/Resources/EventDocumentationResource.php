<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventDocumentationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'report_id' => $this->report_id,
            'image_url' => asset('storage/' . $this->image_path),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\EventCategoryResource;
use App\Models\EventCategory;

class EventCategoryController extends BaseController
{
    public function index()
    {
        $categories = EventCategory::all();
        return $this->success(
            EventCategoryResource::collection($categories),
            'Daftar kategori event berhasil diambil.'
        );
    }
}

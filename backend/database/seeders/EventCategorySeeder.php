<?php

namespace Database\Seeders;

use App\Models\EventCategory;
use Illuminate\Database\Seeder;

class EventCategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Lingkungan',
            'Pendidikan',
            'Kesehatan',
            'Sosial',
            'Kemanusiaan',
        ];

        foreach ($categories as $name) {
            EventCategory::firstOrCreate(['name' => $name]);
        }
    }
}

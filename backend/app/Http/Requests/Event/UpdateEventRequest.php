<?php

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['sometimes', 'exists:event_categories,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'province' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'location_name' => ['nullable', 'string', 'max:255'],
            'quota' => ['sometimes', 'integer', 'min:1'],
            'event_date' => ['sometimes', 'date', 'after_or_equal:today'],
            'start_time' => ['sometimes', 'date_format:H:i'],
            'end_time' => ['sometimes', 'date_format:H:i', 'after:start_time'],
            'banner' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.exists' => 'Kategori event tidak ditemukan.',
            'title.max' => 'Judul event maksimal 255 karakter.',
            'quota.integer' => 'Kuota peserta harus berupa angka.',
            'quota.min' => 'Kuota peserta minimal 1.',
            'event_date.after_or_equal' => 'Tanggal event tidak boleh sebelum hari ini.',
            'start_time.date_format' => 'Format waktu mulai tidak valid (HH:MM).',
            'end_time.date_format' => 'Format waktu selesai tidak valid (HH:MM).',
            'end_time.after' => 'Waktu selesai harus setelah waktu mulai.',
        ];
    }
}

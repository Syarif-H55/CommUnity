<?php

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:event_categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'province' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'location_name' => ['nullable', 'string', 'max:255'],
            'quota' => ['required', 'integer', 'min:1'],
            'event_date' => ['required', 'date', 'after_or_equal:today'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'banner' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'category_id.required' => 'Kategori event wajib diisi.',
            'category_id.exists' => 'Kategori event tidak ditemukan.',
            'title.required' => 'Judul event wajib diisi.',
            'title.max' => 'Judul event maksimal 255 karakter.',
            'quota.required' => 'Kuota peserta wajib diisi.',
            'quota.integer' => 'Kuota peserta harus berupa angka.',
            'quota.min' => 'Kuota peserta minimal 1.',
            'event_date.required' => 'Tanggal event wajib diisi.',
            'event_date.after_or_equal' => 'Tanggal event tidak boleh sebelum hari ini.',
            'start_time.required' => 'Waktu mulai wajib diisi.',
            'start_time.date_format' => 'Format waktu mulai tidak valid (HH:MM).',
            'end_time.required' => 'Waktu selesai wajib diisi.',
            'end_time.date_format' => 'Format waktu selesai tidak valid (HH:MM).',
            'end_time.after' => 'Waktu selesai harus setelah waktu mulai.',
            'banner.image' => 'Banner harus berupa gambar.',
            'banner.mimes' => 'Format banner harus JPG, PNG, atau WebP.',
            'banner.max' => 'Ukuran banner maksimal 5MB.',
        ];
    }
}

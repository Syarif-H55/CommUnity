<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'summary' => ['sometimes', 'required', 'string', 'max:5000'],
            'total_attendees' => ['sometimes', 'required', 'integer', 'min:1'],
            'photos' => ['sometimes', 'required', 'array', 'min:1', 'max:5'],
            'photos.*' => ['image', 'mimes:jpg,jpeg,png', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'summary.required' => 'Ringkasan kegiatan wajib diisi.',
            'summary.max' => 'Ringkasan kegiatan maksimal 5000 karakter.',
            'total_attendees.required' => 'Jumlah peserta wajib diisi.',
            'total_attendees.integer' => 'Jumlah peserta harus berupa angka.',
            'total_attendees.min' => 'Jumlah peserta minimal 1.',
            'photos.required' => 'Minimal 1 foto dokumentasi wajib diunggah.',
            'photos.min' => 'Minimal 1 foto dokumentasi wajib diunggah.',
            'photos.max' => 'Maksimal 5 foto dokumentasi diperbolehkan.',
            'photos.*.image' => 'File harus berupa gambar.',
            'photos.*.mimes' => 'Format foto harus jpg, jpeg, atau png.',
            'photos.*.max' => 'Ukuran foto maksimal 5MB.',
        ];
    }
}

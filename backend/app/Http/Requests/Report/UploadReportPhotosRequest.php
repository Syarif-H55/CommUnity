<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class UploadReportPhotosRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'photos' => ['required', 'array', 'min:1', 'max:5'],
            'photos.*' => ['image', 'mimes:jpg,jpeg,png', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'photos.required' => 'Minimal 1 foto wajib diunggah.',
            'photos.min' => 'Minimal 1 foto wajib diunggah.',
            'photos.max' => 'Maksimal 5 foto dalam satu kali upload.',
            'photos.*.image' => 'File harus berupa gambar.',
            'photos.*.mimes' => 'Format foto harus jpg, jpeg, atau png.',
            'photos.*.max' => 'Ukuran foto maksimal 5MB.',
        ];
    }
}

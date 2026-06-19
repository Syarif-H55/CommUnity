<?php

namespace App\Http\Requests\Organization;

use Illuminate\Foundation\Http\FormRequest;

class UploadDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'document' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ];
    }

    public function messages(): array
    {
        return [
            'document.required' => 'Dokumen verifikasi wajib diunggah.',
            'document.mimes' => 'Dokumen harus berupa PDF, JPG, JPEG, atau PNG.',
            'document.max' => 'Dokumen maksimal 5 MB.',
        ];
    }
}

<?php

namespace App\Http\Requests\Organization;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrganizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'organization_email' => ['nullable', 'email', 'max:255', 'unique:organizations,organization_email'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Nama organisasi wajib diisi.',
            'name.max' => 'Nama organisasi maksimal 255 karakter.',
            'organization_email.email' => 'Format email organisasi tidak valid.',
            'organization_email.unique' => 'Email organisasi sudah digunakan.',
        ];
    }
}

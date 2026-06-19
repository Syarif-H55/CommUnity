<?php

namespace App\Http\Requests\Organization;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrganizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $organization = $this->route('organization');

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'organization_email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('organizations', 'organization_email')->ignore($organization->id),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.max' => 'Nama organisasi maksimal 255 karakter.',
            'organization_email.email' => 'Format email organisasi tidak valid.',
            'organization_email.unique' => 'Email organisasi sudah digunakan.',
        ];
    }
}

<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class VerifyOrganizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->is_admin;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:approved,rejected'],
            'rejection_reason' => ['required_if:status,rejected', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status verifikasi wajib diisi.',
            'status.in' => 'Status harus approved atau rejected.',
            'rejection_reason.required_if' => 'Alasan penolakan wajib diisi.',
        ];
    }
}

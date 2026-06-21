<?php

namespace App\Http\Requests\Organization;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMemberRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'role' => ['required', 'string', 'in:Penyelenggara,Koordinator Event'],
        ];
    }

    public function messages(): array
    {
        return [
            'role.required' => 'Role wajib diisi.',
            'role.in' => 'Role harus berupa Penyelenggara atau Koordinator Event.',
        ];
    }
}

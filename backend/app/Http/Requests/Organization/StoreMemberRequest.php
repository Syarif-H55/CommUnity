<?php

namespace App\Http\Requests\Organization;

use Illuminate\Foundation\Http\FormRequest;

class StoreMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'string', 'exists:users,id'],
            'role' => ['required', 'string', 'in:Penyelenggara,Koordinator Event'],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'ID pengguna wajib diisi.',
            'user_id.exists' => 'Pengguna tidak ditemukan.',
            'role.required' => 'Role wajib diisi.',
            'role.in' => 'Role harus berupa Penyelenggara atau Koordinator Event.',
        ];
    }
}

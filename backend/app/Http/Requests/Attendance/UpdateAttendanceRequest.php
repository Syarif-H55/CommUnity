<?php

namespace App\Http\Requests\Attendance;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'in:present,late,absent'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status kehadiran wajib diisi.',
            'status.in' => 'Status kehadiran harus present, late, atau absent.',
        ];
    }
}

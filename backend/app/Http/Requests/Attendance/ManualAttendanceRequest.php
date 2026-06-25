<?php

namespace App\Http\Requests\Attendance;

use Illuminate\Foundation\Http\FormRequest;

class ManualAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'volunteer_id' => ['required', 'exists:users,id'],
            'status' => ['required', 'in:present,late,absent'],
        ];
    }

    public function messages(): array
    {
        return [
            'volunteer_id.required' => 'ID relawan wajib diisi.',
            'volunteer_id.exists' => 'Relawan tidak ditemukan.',
            'status.required' => 'Status kehadiran wajib diisi.',
            'status.in' => 'Status kehadiran harus present, late, atau absent.',
        ];
    }
}

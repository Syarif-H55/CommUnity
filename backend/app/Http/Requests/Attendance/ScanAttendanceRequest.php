<?php

namespace App\Http\Requests\Attendance;

use Illuminate\Foundation\Http\FormRequest;

class ScanAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [];
    }

    public function messages(): array
    {
        return [
            'volunteer_id.required' => 'ID relawan wajib diisi.',
            'volunteer_id.exists' => 'Relawan tidak ditemukan.',
            'event_id.required' => 'ID event wajib diisi.',
            'event_id.exists' => 'Event tidak ditemukan.',
        ];
    }
}

<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class ReviewEventReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'action' => ['required', 'string', 'in:approved,revision_requested'],
            'rejection_reason' => ['required_if:action,revision_requested', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'action.required' => 'Aksi review wajib diisi.',
            'action.in' => 'Aksi review harus approved atau revision_requested.',
            'rejection_reason.required_if' => 'Alasan revisi wajib diisi jika mengajukan revisi.',
            'rejection_reason.max' => 'Alasan revisi maksimal 1000 karakter.',
        ];
    }
}

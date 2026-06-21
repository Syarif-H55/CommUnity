<?php

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;

class PublishEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:published'],
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Status wajib diisi.',
            'status.in' => 'Status harus published.',
        ];
    }
}

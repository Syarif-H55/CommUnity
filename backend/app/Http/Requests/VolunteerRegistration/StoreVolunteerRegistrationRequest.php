<?php

namespace App\Http\Requests\VolunteerRegistration;

use Illuminate\Foundation\Http\FormRequest;

class StoreVolunteerRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [];
    }
}

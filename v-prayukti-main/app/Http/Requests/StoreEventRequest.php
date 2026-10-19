<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'short_name' => 'nullable|string|max:255',
            'image_url' => 'nullable|url',
            'form_url' => 'nullable|url',
            'type' => 'required|string|max:255',
            'rulebook_url' => 'nullable|url',
            'domain' => 'nullable|string',
            'tag' => 'nullable|string|max:255',
            'fee' => 'nullable|string|max:255',
            'deadline' => 'nullable|date',
            'team_count' => 'nullable|string|max:255',
            'team_formation' => 'nullable|string',
            'problem_url' => 'nullable|url',
            'introduction' => 'nullable|string',
            'description' => 'nullable|string',
            'info' => 'nullable|string',
            'eligibility' => 'nullable|string',
            'faculty_contacts' => 'nullable|array',
            'student_contacts' => 'nullable|array',
            'contact_email' => 'nullable|email|max:255',
            'status' => 'nullable|string|max:255',
            'event_day' => 'nullable|string|max:255',
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'success' => false,
            'message' => 'Validation errors',
            'data' => $validator->errors(),
        ], 422));
    }
}

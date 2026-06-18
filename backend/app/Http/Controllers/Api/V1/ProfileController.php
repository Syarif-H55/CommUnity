<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Profile\UpdateProfileRequest;
use App\Http\Requests\Profile\UploadPhotoRequest;
use App\Http\Resources\UserResource;
use App\Services\ProfileService;

class ProfileController extends BaseController
{
    public function __construct(
        private readonly ProfileService $profileService
    ) {}

    /**
     * Get authenticated user profile.
     */
    public function show()
    {
        $user = auth()->user();

        return $this->success(
            data: new UserResource($user),
            message: 'Profil berhasil dimuat.',
        );
    }

    /**
     * Update authenticated user profile.
     */
    public function update(UpdateProfileRequest $request)
    {
        $user = $this->profileService->update(
            auth()->user(),
            $request->validated()
        );

        return $this->success(
            data: new UserResource($user),
            message: 'Profil berhasil diperbarui.',
        );
    }

    /**
     * Upload profile photo.
     */
    public function uploadPhoto(UploadPhotoRequest $request)
    {
        $user = $this->profileService->uploadPhoto(
            auth()->user(),
            $request->file('photo')
        );

        return $this->success(
            data: new UserResource($user),
            message: 'Foto profil berhasil diunggah.',
        );
    }
}

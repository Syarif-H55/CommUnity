<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProfileService
{
    private const PHOTO_PATH = 'profile-photos';

    /**
     * Update user profile information.
     */
    public function update(User $user, array $data): User
    {
        $user->update($data);

        return $user->fresh();
    }

    /**
     * Upload and update profile photo.
     */
    public function uploadPhoto(User $user, UploadedFile $photo): User
    {
        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }

        $path = $photo->store(self::PHOTO_PATH, 'public');

        $user->update([
            'profile_photo_path' => $path,
        ]);

        return $user->fresh();
    }
}

<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class AuthService
{
    /**
     * Register a new user and return an access token.
     */
    public function register(array $data): array
    {
        $user = User::create([
            'full_name' => $data['full_name'],
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    /**
     * Authenticate user and return an access token.
     */
    public function login(array $data): ?array
    {
        $user = User::where('username', $data['username'])->first();

        if (!$user || !Hash::check($data['password'], $user->password)) {
            return null;
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return ['user' => $user, 'token' => $token];
    }

    /**
     * Revoke the current access token.
     */
    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    /**
     * Send password reset link (stores token in DB for MVP).
     */
    public function forgotPassword(string $email): string
    {
        $user = User::where('email', $email)->first();

        if (!$user) {
            return 'Kami telah mengirimkan token reset password ke email Anda.';
        }

        $token = Str::random(60);

        \DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $email],
            ['email' => $email, 'token' => Hash::make($token), 'created_at' => now()]
        );

        return $token;
    }

    /**
     * Reset password using email and token.
     *
     * @return bool true if successful, false if token invalid/expired
     */
    public function resetPassword(array $data): bool
    {
        $record = \DB::table('password_reset_tokens')->where('email', $data['email'])->first();

        if (!$record || !Hash::check($data['token'], $record->token)) {
            return false;
        }

        if (now()->diffInMinutes($record->created_at) > 60) {
            \DB::table('password_reset_tokens')->where('email', $data['email'])->delete();
            return false;
        }

        $user = User::where('email', $data['email'])->first();

        if (!$user) {
            return false;
        }

        $user->update([
            'password' => Hash::make($data['password']),
        ]);

        \DB::table('password_reset_tokens')->where('email', $data['email'])->delete();

        return true;
    }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;

class AuthController extends BaseController
{
    public function __construct(
        private readonly AuthService $authService
    ) {}

    /**
     * Register a new user account.
     */
    public function register(RegisterRequest $request)
    {
        $result = $this->authService->register($request->validated());

        return $this->success(
            data: [
                'user' => new UserResource($result['user']),
                'token' => $result['token'],
            ],
            message: 'Registrasi berhasil.',
            code: 201,
        );
    }

    /**
     * Authenticate user and return access token.
     */
    public function login(LoginRequest $request)
    {
        $result = $this->authService->login($request->validated());

        if (!$result) {
            return $this->error('Kredensial yang diberikan tidak valid.', 422, [
                'username' => ['Kredensial yang diberikan tidak valid.'],
            ]);
        }

        return $this->success([
            'user' => new UserResource($result['user']),
            'token' => $result['token'],
        ], 'Login berhasil.');
    }

    /**
     * Revoke current access token.
     */
    public function logout()
    {
        $this->authService->logout(auth()->user());

        return $this->success(null, 'Logout berhasil.');
    }

    /**
     * Send password reset token to user email.
     */
    public function forgotPassword(ForgotPasswordRequest $request)
    {
        $token = $this->authService->forgotPassword($request->input('email'));

        return $this->success([
            'reset_token' => $token,
        ], 'Token reset password telah dikirim.');
    }

    /**
     * Reset password using email and token.
     */
    public function resetPassword(ResetPasswordRequest $request)
    {
        $success = $this->authService->resetPassword($request->validated());

        if (!$success) {
            return $this->error('Token reset password tidak valid atau sudah kadaluarsa.', 422, [
                'email' => ['Token reset password tidak valid atau sudah kadaluarsa.'],
            ]);
        }

        return $this->success(null, 'Password berhasil direset.');
    }
}

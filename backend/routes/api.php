<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\Admin\OrganizationVerificationController;
use App\Http\Controllers\Api\V1\EventCategoryController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\OrganizationController;
use App\Http\Controllers\Api\V1\OrganizationMemberController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\VolunteerRegistrationController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Health check
    Route::get('/health', function () {
        return response()->json([
            'success' => true,
            'message' => 'CommUnity API is running',
        ]);
    });

    // Auth endpoints (public)
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    });

    // Authenticated endpoints
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);

        Route::get('/profile', [ProfileController::class, 'show']);
        Route::patch('/profile', [ProfileController::class, 'update']);
        Route::post('/profile/photo', [ProfileController::class, 'uploadPhoto']);

        // Organization endpoints
        Route::apiResource('organizations', OrganizationController::class);
        Route::post('/organizations/{organization}/upload-document', [OrganizationController::class, 'uploadDocument']);

        // Organization member endpoints
        Route::get('/organizations/{organization}/members', [OrganizationMemberController::class, 'index']);
        Route::post('/organizations/{organization}/members', [OrganizationMemberController::class, 'store']);
        Route::patch('/organizations/{organization}/members/{member}', [OrganizationMemberController::class, 'update']);
        Route::delete('/organizations/{organization}/members/{member}', [OrganizationMemberController::class, 'destroy']);

        // Event category endpoints
        Route::get('/event-categories', [EventCategoryController::class, 'index']);

        // Event endpoints
        Route::get('/my-events', [EventController::class, 'myEvents']);
        Route::patch('/events/{event}/publish', [EventController::class, 'publish']);
        Route::apiResource('events', EventController::class);

        // Volunteer registration endpoints
        Route::get('/my-registrations', [VolunteerRegistrationController::class, 'myRegistrations']);
        Route::post('/events/{event}/register', [VolunteerRegistrationController::class, 'register']);

        // Admin endpoints
        Route::prefix('admin')->group(function () {
            Route::patch('/organizations/{organization}/verify', [OrganizationVerificationController::class, 'verify']);
        });
    });
});

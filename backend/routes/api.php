<?php

use App\Http\Controllers\Api\V1\AttendanceController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\Admin\AdminOrganizationController;
use App\Http\Controllers\Api\V1\Admin\AdminStatsController;
use App\Http\Controllers\Api\V1\Admin\AdminUserController;
use App\Http\Controllers\Api\V1\Admin\OrganizationVerificationController;
use App\Http\Controllers\Api\V1\EventCategoryController;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\EventPermissionController;
use App\Http\Controllers\Api\V1\AiReportController;
use App\Http\Controllers\Api\V1\EventReportController;
use App\Http\Controllers\Api\V1\OrganizationController;
use App\Http\Controllers\Api\V1\OrganizationMemberController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\UserContextController;
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

        // User role context
        Route::get('/my-context', UserContextController::class);

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
        Route::get('/events/{event}/permissions', EventPermissionController::class);

        // Volunteer registration endpoints
        Route::get('/my-registrations', [VolunteerRegistrationController::class, 'myRegistrations']);
        Route::post('/events/{event}/register', [VolunteerRegistrationController::class, 'register']);

        // Attendance endpoints
        Route::get('/events/{event}/attendance-qr', [AttendanceController::class, 'generateQr']);
        Route::post('/events/{event}/attendance/scan', [AttendanceController::class, 'scan']);
        Route::get('/events/{event}/attendances', [AttendanceController::class, 'eventAttendances']);
        Route::post('/events/{event}/attendances', [AttendanceController::class, 'manual']);
        Route::patch('/events/{event}/attendances/{attendance}', [AttendanceController::class, 'updateAttendanceStatus']);
        Route::get('/events/{event}/attendance-summary', [AttendanceController::class, 'summary']);
        Route::get('/my-attendances', [AttendanceController::class, 'myAttendances']);

        // Report endpoints
        Route::get('/events/{event}/report', [EventReportController::class, 'show']);
        Route::post('/events/{event}/report', [EventReportController::class, 'store']);
        Route::patch('/events/{event}/report', [EventReportController::class, 'update']);
        Route::post('/events/{event}/report/photos', [EventReportController::class, 'uploadPhotos']);
        Route::delete('/events/{event}/report/photos/{photo}', [EventReportController::class, 'deletePhoto']);
        Route::post('/events/{event}/report/submit', [EventReportController::class, 'submit']);
        Route::post('/events/{event}/report/review', [EventReportController::class, 'review']);

        // AI Report Assistant
        Route::post('/events/{event}/report/ai-generate', [AiReportController::class, 'generate']);

        // Admin endpoints
        Route::prefix('admin')->group(function () {
            Route::get('/stats', AdminStatsController::class);
            Route::get('/organizations', [AdminOrganizationController::class, 'index']);
            Route::get('/users', [AdminUserController::class, 'index']);
            Route::patch('/organizations/{organization}/verify', [OrganizationVerificationController::class, 'verify']);
        });
    });
});

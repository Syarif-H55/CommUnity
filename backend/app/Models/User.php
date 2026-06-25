<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasUuids, Notifiable, SoftDeletes;

    protected $fillable = [
        'full_name',
        'username',
        'email',
        'password',
        'profile_photo_path',
        'is_admin',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }

    public function organizations()
    {
        return $this->belongsToMany(Organization::class, 'organization_memberships')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    public function registrations()
    {
        return $this->hasMany(VolunteerRegistration::class, 'volunteer_id');
    }

    public function registeredEvents()
    {
        return $this->belongsToMany(Event::class, 'volunteer_registrations', 'volunteer_id', 'event_id')
            ->withPivot('registered_at')
            ->withTimestamps();
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'volunteer_id');
    }

    public function validatedAttendances()
    {
        return $this->hasMany(Attendance::class, 'validated_by');
    }
}

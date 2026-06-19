<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organization extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'organization_email',
        'description',
        'logo',
        'verification_document',
        'verification_status',
        'rejection_reason',
        'verified_at',
    ];

    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
        ];
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'organization_memberships')
            ->withPivot('role', 'joined_at')
            ->withTimestamps();
    }

    public function penyelenggara()
    {
        return $this->members()->wherePivot('role', 'Penyelenggara');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'coordinator_id',
        'category_id',
        'title',
        'description',
        'province',
        'city',
        'location_name',
        'quota',
        'event_date',
        'start_time',
        'end_time',
        'status',
        'banner',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date:Y-m-d',
            'start_time' => 'datetime:H:i',
            'end_time' => 'datetime:H:i',
            'quota' => 'integer',
        ];
    }

    public function organization()
    {
        return $this->belongsTo(Organization::class);
    }

    public function coordinator()
    {
        return $this->belongsTo(User::class, 'coordinator_id');
    }

    public function category()
    {
        return $this->belongsTo(EventCategory::class, 'category_id');
    }

    public function registrations()
    {
        return $this->hasMany(VolunteerRegistration::class);
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'volunteer_registrations', 'event_id', 'volunteer_id')
            ->withPivot('registered_at')
            ->withTimestamps();
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function report()
    {
        return $this->hasOne(EventReport::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventDocumentation extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'event_documentations';

    protected $fillable = [
        'report_id',
        'image_path',
    ];

    public function report(): BelongsTo
    {
        return $this->belongsTo(EventReport::class, 'report_id');
    }
}

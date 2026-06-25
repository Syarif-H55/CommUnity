<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('event_id');
            $table->uuid('volunteer_id');
            $table->enum('status', ['present', 'late', 'absent']);
            $table->timestamp('attendance_time')->nullable();
            $table->uuid('validated_by')->nullable();
            $table->timestamps();

            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            $table->foreign('volunteer_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('validated_by')->references('id')->on('users')->onDelete('set null');

            $table->unique(['event_id', 'volunteer_id']);
            $table->index('event_id');
            $table->index('volunteer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('volunteer_registrations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('event_id');
            $table->uuid('volunteer_id');
            $table->timestamp('registered_at');
            $table->timestamps();

            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            $table->foreign('volunteer_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['event_id', 'volunteer_id']);

            $table->index('event_id');
            $table->index('volunteer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('volunteer_registrations');
    }
};

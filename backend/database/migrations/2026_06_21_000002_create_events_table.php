<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('organization_id');
            $table->uuid('coordinator_id');
            $table->unsignedBigInteger('category_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('province')->nullable();
            $table->string('city')->nullable();
            $table->string('location_name')->nullable();
            $table->integer('quota');
            $table->date('event_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('status')->default('draft');
            $table->softDeletes();
            $table->timestamps();

            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
            $table->foreign('coordinator_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('event_categories')->onDelete('cascade');

            $table->index('category_id');
            $table->index('city');
            $table->index('event_date');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};

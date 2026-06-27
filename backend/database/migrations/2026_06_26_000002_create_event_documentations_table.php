<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('event_documentations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('report_id');
            $table->string('image_path');
            $table->timestamps();

            $table->foreign('report_id')->references('id')->on('event_reports')->onDelete('cascade');
            $table->index('report_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('event_documentations');
    }
};

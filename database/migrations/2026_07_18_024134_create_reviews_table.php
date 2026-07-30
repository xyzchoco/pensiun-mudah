<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id(); // Primary key otomatis
            $table->unsignedBigInteger('user_id'); // Foreign key ke users.user_id
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->unsignedBigInteger('course_id'); // Foreign key ke courses.id
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->unsignedTinyInteger('rating')->comment('Rating dari 1 sampai 5'); // Rating 1-5
            $table->text('comment')->nullable(); // Komentar review (opsional)
            $table->timestamps(); // created_at dan updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
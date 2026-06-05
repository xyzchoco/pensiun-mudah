<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            
            $table->dateTime('tanggal_daftar');
            $table->enum('status', ['active', 'completed', 'dropped'])->default('active');
            $table->decimal('progress_persen', 5, 2)->default(0); // 0.00 sampai 100.00
            $table->boolean('is_completed')->default(false);
            $table->dateTime('tanggal_selesai')->nullable();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
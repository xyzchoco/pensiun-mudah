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
        Schema::create('absensi_seminar', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sesi_seminar_id')->constrained('sesi_seminar')->onDelete('cascade');
            $table->unsignedBigInteger('user_id'); // Custom primary key for users
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->string('status')->default('belum'); // 'belum' | 'hadir' | 'tidak_hadir'
            $table->timestamp('waktu_absen')->nullable();
            $table->timestamps();
            $table->unique(['sesi_seminar_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absensi_seminar');
    }
};

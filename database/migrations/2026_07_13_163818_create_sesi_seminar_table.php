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
        Schema::create('sesi_seminar', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            $table->string('judul');
            $table->date('tanggal');
            $table->time('jam');
            $table->string('lokasi');
            $table->string('link_maps')->nullable();
            $table->integer('kapasitas_ruangan')->nullable();
            $table->text('catatan')->nullable();
            $table->string('status')->default('disetujui'); // 'pending', 'disetujui', 'ditolak'
            $table->text('alasan_penolakan')->nullable();
            $table->foreignId('requester_id')->nullable()->constrained('users', 'user_id')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sesi_seminar');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();

            // Relasi ke kategori dan user (admin/instruktur yang bikin)
            $table->foreignId('category_id')->constrained('course_categories');
            $table->foreignId('created_by')->constrained('users', 'user_id');

            $table->string('title');
            $table->string('tipe_kelas')->default('Online'); // Online | Offline | Hybrid
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('thumbnail')->nullable();

            // Harga
            $table->enum('course_type', ['free', 'premium'])->default('free');
            $table->decimal('price', 10, 2)->default(0);

            // ===== Default pelaksanaan (khusus Offline/Hybrid) =====
            // Jadi patokan default + acuan sistem deteksi request custom
            $table->date('tanggal_default')->nullable();
            $table->string('lokasi_default')->nullable();
            $table->string('jadwal_default', 100)->nullable(); // cth: "09:00 - 15:00 WIB"
            // (opsional, kalau mau instruktur & durasi dinamis)
            $table->string('instruktur')->nullable();
            $table->string('durasi')->nullable();

            // Publikasi & visibilitas
            $table->string('status')->default('draft');
            $table->boolean('is_visible_publik')->default(false);
            $table->boolean('is_visible_korporat')->default(false);
            $table->boolean('is_visible_asn')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
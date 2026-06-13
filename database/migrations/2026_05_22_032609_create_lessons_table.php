<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lessons', function (Blueprint $table) {
            $table->id();
            
            // Relasi ke tabel Courses
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            
            $table->string('title'); // Judul materi (misal: "Bab 1: Pengenalan Saham")
        $table->string('slug')->unique();
            $table->string('video_url')->nullable(); // Link video YouTube/Vimeo
            $table->longText('content')->nullable(); // Teks materi penjelasan
            $table->integer('order')->default(1); // Urutan materi (1, 2, 3, dst)
            $table->boolean('is_free')->default(false); // Bisa diakses gratis sebagai preview?
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
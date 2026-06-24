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
            $table->string('tipe_kelas')->default('Online');
            $table->string('slug')->unique(); // Untuk URL SEO friendly
            $table->text('description')->nullable();
            $table->string('thumbnail')->nullable();
            $table->enum('course_type', ['free', 'premium'])->default('free');
            $table->decimal('price', 10, 2)->default(0);
            $table->string('status')->default('draft'); // draft, published
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('learning_progress', function (Blueprint $table) {
            $table->id('progress_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('module_id')->nullable()->constrained('modules')->cascadeOnDelete();
            $table->foreignId('material_id')->nullable()->constrained('materials')->cascadeOnDelete();
            $table->boolean('is_completed')->default(false);
            $table->float('persentase')->default(0);
            $table->integer('durasi_belajar')->default(0); // Simpan dalam hitungan menit/detik
            $table->timestamp('last_accessed')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_progress');
    }
};

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
        Schema::create('learning_activities', function (Blueprint $table) {
            $table->id('activity_id');
            $table->foreignId('user_id')->constrained('users', 'user_id')->cascadeOnDelete();
            $table->date('tanggal');
            $table->float('durasi_jam')->default(0); // Durasi belajar pada hari tersebut
            $table->string('kategori')->nullable();
            $table->string('modul')->nullable();
            $table->string('topik')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_activities');
    }
};

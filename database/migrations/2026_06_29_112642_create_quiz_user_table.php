<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_user', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->unsignedBigInteger('quiz_id')->index();
            $table->integer('score')->default(0);
            $table->boolean('is_passed')->default(false);
            $table->timestamps();

            // Satu user hanya punya satu record per kuis
            $table->unique(['user_id', 'quiz_id']);

            // Foreign keys
            $table->foreign('quiz_id')
                  ->references('id')
                  ->on('quizzes')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_user');
    }
};
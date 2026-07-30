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
            $table->integer('correct_count')->default(0);
            $table->integer('total_questions')->default(0);
            $table->integer('time_taken_minutes')->default(0);
            $table->json('wrong_questions')->nullable();
            $table->timestamps();

            // Satu user hanya punya satu record per kuis
            $table->unique(['user_id', 'quiz_id']);

            // Foreign keys
            $table->foreign('user_id')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade');
            
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
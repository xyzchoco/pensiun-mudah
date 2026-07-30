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
        Schema::create('webinar_registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('webinar_id')->constrained('webinars')->cascadeOnDelete();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('user_id')->on('users')->cascadeOnDelete();
            $table->string('status')->default('terdaftar');
            $table->timestamp('registered_at')->nullable();
            $table->timestamps();
            $table->unique(['webinar_id', 'user_id']);
            $table->timestamp('reminder_sent_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('webinar_registrations');
    }
};

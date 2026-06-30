<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id('notif_id');

            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')
                  ->references('user_id')->on('users')
                  ->onDelete('cascade');

            $table->string('judul');
            $table->text('isi');
            $table->enum('type', ['success', 'danger', 'info', 'warning', 'reminder'])
                  ->default('info');
            $table->boolean('is_read')->default(false);
            $table->string('action_label')->nullable();
            $table->string('action_url')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
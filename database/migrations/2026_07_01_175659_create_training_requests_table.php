<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('training_requests', function (Blueprint $table) {
            $table->id('request_id');

            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('course_id');

            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->time('jam_mulai')->nullable();
            $table->time('jam_selesai')->nullable();

            $table->integer('jumlah_peserta')->default(1);
            $table->string('usulan_lokasi')->nullable();
            $table->decimal('estimasi_harga', 12, 2)->default(0);
            $table->boolean('is_custom')->default(false);
            $table->string('status')->default('menunggu_approval');
            $table->timestamp('payment_due_at')->nullable();
            $table->text('alasan_penolakan')->nullable();
            $table->unsignedBigInteger('voucher_id')->nullable();

            $table->timestamps();

            $table->index('status');
            $table->index('user_id');

            $table->foreign('user_id')
                  ->references('user_id')->on('users')
                  ->onDelete('cascade');

            $table->foreign('course_id')
                  ->references('id')->on('courses')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('training_requests');
    }
};
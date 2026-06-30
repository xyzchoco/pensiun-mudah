<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
    // 1. Tabel Utama Voucher
        Schema::create('corporate_vouchers', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedBigInteger('corporate_user_id');
            $table->unsignedBigInteger('course_id'); 
            $table->string('code')->unique(); 
            $table->string('target_kategori'); 
            $table->integer('max_uses')->default(1); 
            $table->integer('used_count')->default(0);
            $table->timestamps();

            $table->foreign('corporate_user_id')->references('user_id')->on('users')->onDelete('cascade');
        });

        // 2. Tabel History Klaim
        Schema::create('voucher_redemptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('corporate_voucher_id');
            $table->timestamp('redeemed_at');

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('corporate_voucher_id')->references('id')->on('corporate_vouchers')->onDelete('cascade');
            
            $table->unique(['user_id', 'corporate_voucher_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('voucher_redemptions');
        Schema::dropIfExists('corporate_vouchers');
    }
};
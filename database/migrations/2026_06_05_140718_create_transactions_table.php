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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users', 'user_id')->cascadeOnDelete();
            $table->foreignId('course_id')->constrained('courses')->cascadeOnDelete();
            $table->foreignId('payment_method_id')->nullable()->constrained('payment_methods')->nullOnDelete();
            
            $table->string('nomor_transaksi')->unique(); // Invoice: INV-20260522-XXX
            $table->integer('jumlah_peserta')->default(1);
            $table->decimal('harga_per_peserta', 15, 2)->default(0);
            $table->decimal('nominal', 15, 2); // Ini total_harga
            
            $table->enum('status', ['pending', 'success', 'failed', 'expired'])->default('pending');
            $table->string('snap_token')->nullable(); // Kunci bypass Midtrans
            $table->string('snap_redirect_url')->nullable(); 
            $table->dateTime('batas_waktu');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
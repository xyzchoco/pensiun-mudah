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
        Schema::create('corporate_profiles', function (Blueprint $table) {
        $table->id('corp_profile_id');
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->string('nama_perusahaan');
        $table->string('jabatan');
        $table->string('kategori_bisnis');
        $table->string('email_perusahaan');
        $table->string('alamat_kantor');
        $table->string('email_bisnis');
        $table->string('no_telepon');
        $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('corporate_profiles');
    }
};

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
        Schema::create('webinars', function (Blueprint $table) {
            $table->id(); // Ini jadi webinar_id
            $table->string('judul');
            $table->string('kategori')->default('Umum'); // ex: Kewirausahaan
            $table->enum('jenis_event', ['Online', 'Offline']); 
            $table->date('tanggal');
            $table->time('jam');
            $table->string('narasumber');
            $table->string('lokasi_link'); // Link Gmeet / Alamat gedung
            $table->integer('kapasitas');
            $table->text('deskripsi');
            $table->string('image_path')->nullable(); // Wajib buat UI
            $table->boolean('is_published')->default(false);
            $table->timestamps(); // created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::dropIfExists('webinars');
    }
};

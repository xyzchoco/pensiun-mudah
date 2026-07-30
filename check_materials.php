<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Material;

echo "=== CHECK MATERIALS DURATION ===\n\n";

$materials = Material::whereIn('id', [3, 4])->get();
foreach ($materials as $m) {
    echo "Material ID {$m->id}: {$m->judul}\n";
    echo "  Durasi: {$m->durasi_menit} menit\n";
    echo "  Tipe: {$m->tipe}\n";
    echo "  Video URL: " . ($m->url_video ? "Yes" : "No") . "\n";
    echo "\n";
}
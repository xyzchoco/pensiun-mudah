<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\Material;
use App\Models\LearningProgress;

echo "=== TEST PROGRESS FIX ===\n\n";

// Cek durasi Material 4 (Materi 2)
$material = Material::find(4);
if ($material) {
    echo "Material ID 4: {$material->judul}\n";
    echo "Durasi Asli: {$material->durasi_menit} menit\n";
    echo "Completion Threshold (80%): " . ($material->durasi_menit * 0.8) . " menit\n\n";
    
    // Simulasi: user hanya membaca selama 3 menit (di bawah threshold)
    $reportedDuration = 3;
    $threshold = $material->durasi_menit * 0.8;
    
    echo "Test Scenario 1: User membaca hanya {$reportedDuration} menit\n";
    if ($reportedDuration >= $threshold) {
        echo "  Result: COMPLETED (100%)\n";
    } else {
        $percentage = (int) round(($reportedDuration / $material->durasi_menit) * 100);
        echo "  Result: NOT COMPLETED ({$percentage}%)\n";
    }
    echo "\n";
    
    // Simulasi: user membaca selama 8 menit (di atas threshold)
    $reportedDuration = 8;
    echo "Test Scenario 2: User membaca {$reportedDuration} menit\n";
    if ($reportedDuration >= $threshold) {
        echo "  Result: COMPLETED (100%)\n";
    } else {
        $percentage = (int) round(($reportedDuration / $material->durasi_menit) * 100);
        echo "  Result: NOT COMPLETED ({$percentage}%)\n";
    }
    echo "\n";
    
    // Simulasi: user membaca selama 10 menit (exact match)
    $reportedDuration = 10;
    echo "Test Scenario 3: User membaca {$reportedDuration} menit (exact)\n";
    if ($reportedDuration >= $threshold) {
        echo "  Result: COMPLETED (100%)\n";
    } else {
        $percentage = (int) round(($reportedDuration / $material->durasi_mimit) * 100);
        echo "  Result: NOT COMPLETED ({$percentage}%)\n";
    }
} else {
    echo "Material ID 4 tidak ditemukan!\n";
}
<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$courseId = 3;

$course = App\Models\Course::with(['modules.materials', 'modules.quizzes'])->find($courseId);

if (!$course) {
    echo "Course not found!\n";
    exit;
}

echo "Course: {$course->title}\n";
echo "Total Modules: {$course->modules->count()}\n\n";

foreach ($course->modules->sortBy('urutan') as $module) {
    echo "Module {$module->urutan}: {$module->judul} (ID: {$module->id})\n";
    foreach ($module->materials as $material) {
        echo "  Material: {$material->judul} (ID: {$material->id})\n";
    }
    foreach ($module->quizzes as $quiz) {
        echo "  Quiz: (ID: {$quiz->id})\n";
    }
    echo "\n";
}
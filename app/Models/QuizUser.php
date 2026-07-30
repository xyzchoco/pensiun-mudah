<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuizUser extends Model
{
    protected $table = 'quiz_user';

    protected $fillable = [
        'user_id',
        'quiz_id',
        'score',
        'is_passed',
        'correct_count',
        'total_questions',
        'time_taken_minutes',
        'wrong_questions',
        'submitted_at', // Assuming this might be needed based on migration, though not explicitly in the prompt for the model
    ];

    protected $casts = [
        'is_passed' => 'boolean',
        'wrong_questions' => 'array',
    ];

    /**
     * Get the user that owns the quiz attempt.
     */
    public function user(): BelongsTo
    {
        // Assuming 'user_id' is the foreign key in quiz_user and 'user_id' is the primary key in users table
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    /**
     * Get the quiz that the user is taking.
     */
    public function quiz(): BelongsTo
    {
        return $this->belongsTo(Quiz::class);
    }
}
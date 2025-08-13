<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResponseAnswer extends Model
{
    protected $fillable = [
        'response_id',
        'question_id',
        'value',
    ];

    protected $table = 'response_answers';

    protected $casts = [
        'value' => 'array',
    ];
}



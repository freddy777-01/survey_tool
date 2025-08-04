<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    //
    protected $fillable = [
        'type',
        'structure',
        'question_id'
    ];

    protected $table = 'answers';
}

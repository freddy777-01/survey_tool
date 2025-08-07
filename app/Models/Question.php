<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    //
    protected $fillable = [
        'question',
        'question_uid',
        'description',
        'form_id',
        'section_id',
    ];

    protected $table = 'questions';
}

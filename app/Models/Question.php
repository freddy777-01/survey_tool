<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    //
    protected $fillable = [
        'name',
        'description',
        'form_id',
        'section_id',
    ];

    protected $table = 'questions';
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    //

    protected $fillable = [
        'name',
        'form_uid',
        'description',
        'published',
        'status',
        'begin_date',
        'end_date'
    ];
}

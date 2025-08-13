<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Response extends Model
{
    protected $fillable = [
        'form_id',
        'user_id',
    ];

    protected $table = 'responses';
}



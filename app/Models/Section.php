<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    //
    protected $fillable = [
        'name',
        'section_uid',
        'form_id',
    ];

    protected $table = 'sections';
}

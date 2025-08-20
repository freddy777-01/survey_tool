<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Response extends Model
{
    protected $fillable = [
        'form_id',
        'user_id',
        'session_id',
        'ip_address',
        'is_completed',
        'last_activity',
    ];

    protected $table = 'responses';

    public function responseAnswers()
    {
        return $this->hasMany(ResponseAnswer::class);
    }
}

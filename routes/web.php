<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return Inertia::render('welcome');
});

Route::get('/preview', function () {
    return Inertia::render('Preview/Preview');
});

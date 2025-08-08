<?php

use App\Http\Controllers\FormController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', [FormController::class, 'index']);

Route::get('/preview', [FormController::class, 'preview']);

Route::post('/save-form', [FormController::class, 'store']);

Route::get('/survey/create', [FormController::class, 'create']);

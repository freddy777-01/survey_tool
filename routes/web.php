<?php

use App\Http\Controllers\FormController;
use App\Http\Controllers\SurveyStatsController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

Route::get('/', [FormController::class, 'index']);

Route::get('/preview', [FormController::class, 'preview']);

Route::post('/save-form', [FormController::class, 'store']);

Route::get('/survey/create', [FormController::class, 'createView']);

Route::get('/survey/board', [FormController::class, 'board']);

Route::get('survey/edit', [FormController::class, 'editView']);

// Stats and real-time endpoints
Route::get('/api/surveys/stats', [SurveyStatsController::class, 'stats']);
Route::post('/api/surveys/submit', [SurveyStatsController::class, 'submit']);

// Publish/Unpublish surveys
Route::post('/api/surveys/publish', [FormController::class, 'publish']);
Route::post('/api/surveys/unpublish', [FormController::class, 'unpublish']);

// Attend survey
Route::get('/survey/attend', [FormController::class, 'attend']);

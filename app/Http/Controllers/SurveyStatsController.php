<?php

namespace App\Http\Controllers;

use App\Models\Form;
use App\Models\Response;
use App\Models\ResponseAnswer;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SurveyStatsController extends Controller
{
    public function stats(Request $request)
    {
        $formUid = $request->query('form_uid');
        $form = Form::where('form_uid', $formUid)->first();
        if (!$form) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $participants = $form->responses()->count();
        // If you have a users scope per survey, replace totalUsers accordingly
        $totalUsers = config('app.survey_total_users', 100);

        // Aggregate per-question stats
        $questions = Question::where('form_id', $form->id)->get(['id', 'question_uid', 'question']);
        $perQuestion = [];
        foreach ($questions as $question) {
            $answers = ResponseAnswer::where('question_id', $question->id)->pluck('value');

            // Check if this is a Likert scale question by looking at the answer structure
            $answerData = Answer::where('question_id', $question->id)->first();
            $isLikertScale = $answerData && $answerData->type === 'likert_scale';



            if ($isLikertScale) {
                // Handle Likert scale questions specially
                $likertStats = [];
                $totalResponses = 0;

                foreach ($answers as $answer) {
                    if (is_array($answer)) {
                        // Table Likert scale - each key is a statement ID, value is the selected option
                        foreach ($answer as $statementId => $selectedValue) {
                            if (!isset($likertStats[$statementId])) {
                                $likertStats[$statementId] = [];
                            }
                            $likertStats[$statementId][$selectedValue] = ($likertStats[$statementId][$selectedValue] ?? 0) + 1;
                        }
                        $totalResponses++;
                    } else {
                        // Simple Likert scale - single value
                        $likertStats['simple'][$answer] = ($likertStats['simple'][$answer] ?? 0) + 1;
                        $totalResponses++;
                    }
                }

                $perQuestion[] = [
                    'question_id' => $question->id,
                    'question' => $question->question,
                    'type' => 'likert_scale',
                    'likert_stats' => $likertStats,
                    'total' => $totalResponses,
                ];
            } else {
                // Handle other question types as before
                $flat = [];
                foreach ($answers as $val) {
                    if (is_array($val)) {
                        foreach ($val as $v) {
                            $flat[] = $v;
                        }
                    } elseif (!is_null($val)) {
                        $flat[] = $val;
                    }
                }
                $counts = [];
                foreach ($flat as $v) {
                    $key = is_array($v) ? json_encode($v) : (string)$v;
                    $counts[$key] = ($counts[$key] ?? 0) + 1;
                }
                $perQuestion[] = [
                    'question_id' => $question->id,
                    'question' => $question->question,
                    'type' => 'other',
                    'counts' => $counts,
                    'total' => count($answers),
                ];
            }
        }

        return response()->json([
            'form_uid' => $formUid,
            'participants' => $participants,
            'total' => $totalUsers,
            'status' => $form->status,
            'perQuestion' => $perQuestion,
        ]);
    }

    public function submit(Request $request)
    {
        $validated = $request->validate([
            'form_uid' => 'required|numeric|exists:forms,form_uid',
            'answers' => 'required|array',
        ]);

        $form = Form::where('form_uid', $validated['form_uid'])->firstOrFail(['id', 'form_uid', 'published', 'status', 'begin_date', 'end_date']);

        // Check if survey is published and active
        if (!$form->published || $form->status !== 'active') {
            return response()->json(['message' => 'This survey is not available for participation.'], 403);
        }

        // Check if survey is within timeline
        $now = \Carbon\Carbon::now()->startOfDay();
        $begin = $form->begin_date ? \Carbon\Carbon::parse($form->begin_date) : null;
        $end = $form->end_date ? \Carbon\Carbon::parse($form->end_date) : null;

        if ($begin && $end && !$now->between($begin, $end, true)) {
            return response()->json(['message' => 'This survey is not currently active.'], 403);
        }

        $response = \App\Models\Response::create([
            'form_id' => $form->id,
            'user_id' => \Illuminate\Support\Facades\Auth::check() ? \Illuminate\Support\Facades\Auth::id() : null, // This will be null for anonymous users
            'session_id' => $request->session()->getId(),
            'ip_address' => $request->ip(),
        ]);

        // Get all questions for this form to map question_uid to question_id
        $questions = Question::where('form_id', $form->id)->get(['id', 'question_uid', 'section_id']);
        $questionMap = $questions->pluck('id', 'question_uid')->toArray();



        foreach ($validated['answers'] as $questionUid => $value) {
            // Map question_uid to question_id
            $questionId = $questionMap[$questionUid] ?? null;

            if ($questionId) {
                \App\Models\ResponseAnswer::create([
                    'response_id' => $response->id,
                    'question_id' => $questionId,
                    'value' => is_array($value) ? $value : (string)$value,
                ]);
            }
        }

        return response()->json(['message' => 'Response submitted successfully']);
    }
}

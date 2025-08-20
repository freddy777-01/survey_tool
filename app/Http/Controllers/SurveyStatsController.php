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

        // Check for existing response by session_id and form_id
        $existingResponse = \App\Models\Response::where('form_id', $form->id)
            ->where('session_id', $request->session()->getId())
            ->first();

        if ($existingResponse) {
            // Update existing response (resume)
            $response = $existingResponse;
            $response->update([
                'last_activity' => now(),
            ]);
        } else {
            // Create new response
            $response = \App\Models\Response::create([
                'form_id' => $form->id,
                'user_id' => \Illuminate\Support\Facades\Auth::check() ? \Illuminate\Support\Facades\Auth::id() : null,
                'session_id' => $request->session()->getId(),
                'ip_address' => $request->ip(),
                'is_completed' => false,
                'last_activity' => now(),
            ]);
        }

        // Get all questions for this form to map question_uid to question_id
        $questions = Question::where('form_id', $form->id)->get(['id', 'question_uid', 'section_id']);
        $questionMap = $questions->pluck('id', 'question_uid')->toArray();

        foreach ($validated['answers'] as $questionUid => $value) {
            // Map question_uid to question_id
            $questionId = $questionMap[$questionUid] ?? null;

            if ($questionId) {
                // Use updateOrCreate to handle resuming - allows updating existing answers
                \App\Models\ResponseAnswer::updateOrCreate(
                    [
                        'response_id' => $response->id,
                        'question_id' => $questionId,
                    ],
                    [
                        'value' => is_array($value) ? $value : (string)$value,
                    ]
                );
            }
        }

        // Mark response as completed
        $response->update([
            'is_completed' => true,
            'last_activity' => now(),
        ]);

        return response()->json(['message' => 'Response submitted successfully']);
    }

    public function getExistingResponse(Request $request)
    {
        $formUid = $request->query('form_uid');
        $form = Form::where('form_uid', $formUid)->firstOrFail();

        $existingResponse = \App\Models\Response::where('form_id', $form->id)
            ->where('session_id', $request->session()->getId())
            ->with('responseAnswers.question')
            ->first();

        if ($existingResponse) {
            $answers = [];
            foreach ($existingResponse->responseAnswers as $answer) {
                $answers[$answer->question->question_uid] = $answer->value;
            }

            return response()->json([
                'has_existing_response' => true,
                'answers' => $answers,
                'response_id' => $existingResponse->id,
                'last_updated' => $existingResponse->last_activity,
                'is_completed' => $existingResponse->is_completed
            ]);
        }

        return response()->json(['has_existing_response' => false]);
    }

    public function checkCompletionStatus(Request $request)
    {
        $formUid = $request->query('form_uid');
        $form = Form::where('form_uid', $formUid)->firstOrFail();

        $existingResponse = \App\Models\Response::where('form_id', $form->id)
            ->where('session_id', $request->session()->getId())
            ->first();

        if ($existingResponse) {
            return response()->json([
                'has_response' => true,
                'is_completed' => $existingResponse->is_completed
            ]);
        }

        return response()->json([
            'has_response' => false,
            'is_completed' => false
        ]);
    }

    public function results(Request $request)
    {
        $formUid = $request->query('form_uid');
        $form = Form::where('form_uid', $formUid)->first();

        if (!$form) {
            return response()->json(['message' => 'Survey not found'], 404);
        }

        $questions = Question::where('form_id', $form->id)
            ->orderBy('id')
            ->get(['id', 'question_uid', 'question', 'section_id']);

        $results = [];
        $totalResponses = Response::where('form_id', $form->id)->count();

        foreach ($questions as $question) {
            $answerData = Answer::where('question_id', $question->id)->first();
            $responseAnswers = ResponseAnswer::where('question_id', $question->id)->pluck('value');

            $questionResult = [
                'question' => $question->question,
                'type' => $answerData ? $answerData->type : 'unknown',
                'totalResponses' => $responseAnswers->count(),
            ];

            if ($answerData && $answerData->type === 'likert_scale') {
                // Handle Likert scale questions
                $structure = json_decode($answerData->structure, true);
                $statements = $structure['statements'] ?? [];
                $options = $structure['options'] ?? [];

                $statementResults = [];
                foreach ($statements as $index => $statement) {

                    $statementResponses = [];
                    $statementCount = 0;

                    foreach ($responseAnswers as $answer) {
                        if (is_array($answer) && isset($answer[$index])) {
                            $selectedOption = $answer[$index];
                            $statementResponses[$selectedOption] = ($statementResponses[$selectedOption] ?? 0) + 1;
                            $statementCount++;
                        }
                    }

                    // Extract text from statement object
                    $statementText = '';
                    if (is_string($statement)) {
                        $statementText = $statement;
                    } elseif (is_array($statement)) {
                        // Handle array format - check for 'text' key first
                        if (isset($statement['text'])) {
                            $statementText = $statement['text'];
                        } elseif (isset($statement['t'])) {
                            // Handle optimized format
                            $statementText = $statement['t'];
                        } elseif (count($statement) > 0) {
                            // If it's a simple array, take the first element
                            $statementText = is_string($statement[0]) ? $statement[0] : json_encode($statement[0]);
                        } else {
                            $statementText = "Statement " . ($index + 1);
                        }
                    } elseif (is_object($statement)) {
                        // Handle object format
                        if (isset($statement->text)) {
                            $statementText = $statement->text;
                        } elseif (isset($statement->t)) {
                            $statementText = $statement->t;
                        } else {
                            $statementText = "Statement " . ($index + 1);
                        }
                    } else {
                        // Fallback for any other format
                        $statementText = "Statement " . ($index + 1);
                    }

                    // Ensure we have a valid text
                    if (empty($statementText) || $statementText === 'null' || $statementText === 'undefined') {
                        $statementText = "Statement " . ($index + 1);
                    }

                    $statementResults[] = [
                        'text' => $statementText,
                        'totalResponses' => $statementCount,
                        'responses' => array_map(function ($option, $count) use ($statementCount) {
                            return [
                                'option' => is_string($option) ? $option : (string)$option,
                                'count' => (int)$count,
                                'percentage' => $count > 0 ? round(($count / $statementCount) * 100, 1) : 0
                            ];
                        }, array_keys($statementResponses), array_values($statementResponses))
                    ];
                }

                $questionResult['statements'] = $statementResults;
            } else {
                // Handle other question types
                $flatAnswers = [];
                foreach ($responseAnswers as $answer) {
                    if (is_array($answer)) {
                        foreach ($answer as $value) {
                            if (!is_null($value)) {
                                $flatAnswers[] = $value;
                            }
                        }
                    } elseif (!is_null($answer)) {
                        $flatAnswers[] = $answer;
                    }
                }

                $counts = [];
                foreach ($flatAnswers as $answer) {
                    $counts[$answer] = ($counts[$answer] ?? 0) + 1;
                }

                $totalCount = array_sum($counts);
                $responses = [];
                foreach ($counts as $option => $count) {
                    $responses[] = [
                        'option' => is_string($option) ? $option : (string)$option,
                        'count' => (int)$count,
                        'percentage' => $totalCount > 0 ? round(($count / $totalCount) * 100, 1) : 0
                    ];
                }

                $questionResult['responses'] = $responses;
            }

            $results[] = $questionResult;
        }

        return response()->json([
            'results' => $results,
            'totalResponses' => $totalResponses,
            'formName' => $form->name
        ]);
    }
}

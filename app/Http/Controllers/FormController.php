<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\Form;
use App\Models\Question;
use App\Models\Section;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FormController extends Controller
{
    //
    function index(Request $request)
    {
        $forms = Form::get(['id', 'form_uid', 'name', 'description', 'published', 'status', 'begin_date', 'end_date'])->map(function ($form) {
            $sections = Section::where('form_id', $form['id'])->get(['id', 'name', 'section_uid', 'form_id']);
            $questions = Question::where('form_id', $form['id'])->get(['id', 'question_uid', 'question', 'description', 'form_id', 'section_id'])->map(function ($question) {
                $answers = Answer::where('question_id', $question['id'])->get(['id', 'type', 'structure', 'question_id'])->map(function ($answer) {
                    $answer['structure'] = json_decode($answer['structure']);
                    return $answer;
                });
                $question['answers'] = $answers;
                return $question;
            });
            $form['sections'] = $sections;
            $form['questions'] = $questions;
            return $form;
        });

        // dd($forms);

        return Inertia::render('welcome', ['forms' => $forms]);
    }

    function create(Request $request)
    {
        return Inertia::render('Survey/Form');
    }

    private function removeCurrentFormDetails($form)
    {
        $form_uid = $form['form_uid'];
        if (count($form['sections']) > 0) {
            foreach ($form['sections'] as $key => $s) {

                foreach ($form['questions'] as $key => $q) {
                    if (Section::where('section_uid', $s['id'])->exists()) {
                        if (Question::where('form_id', Form::where('form_uid', $form_uid)->value('id'))->Where('section_id', Section::where('section_uid', $s['id']))->exists()) {
                            if (Answer::where('question_id', Question::where('form_id', Form::where('form_uid', $form_uid)->value('id'))->Where('section_id', Section::where('section_uid', $s['id']))->value('id'))->exists()) {
                                Answer::where('question_id', Question::where('form_id', Form::where('form_uid', $form_uid)->value('id'))->Where('section_id', Section::where('section_uid', $s['id']))->value('id'))->delete();
                            }
                            Question::where('form_id', Form::where('form_uid', $form_uid)->value('id'))->Where('section_id', Section::where('section_uid', $s['id']))->delete();
                        }
                        Section::where('section_uid', $s['id'])->delete();
                    }
                }
            }
        }
    }

    function store(Request $request)
    {

        // dd($request->all());
        $form = $request->all();
        $this->removeCurrentFormDetails($form);
        // $newForm = new Form();
        try {
            DB::beginTransaction();

            /* if (Form::where('form_uid', $form['form_uid'])->exists()) {

            }else{
                $newForm = Form::Crea
            } */

            $newForm = Form::updateOrCreate(
                ['form_uid' => $form['form_uid']],
                [
                    'name' => $form['title'],
                    'description' => $form['description'],
                    'published' => 0,
                    'status' => 'inactive',
                    'form_uid' => $form['form_uid'],
                ]
            );


            if (count($form['sections']) > 0) {

                foreach ($form['sections'] as $key => $s) {
                    //Deleting available sections and questions
                    if (Section::where('section_uid', $s['id'])->exists()) {

                        Section::where('section_uid', $s['id'])->delete();
                    }
                    $section = new Section();

                    $section->name = $s['name'];
                    $section->section_uid = $s['id'];
                    $section->form_id = $newForm->id;
                    if ($section->save()) {
                        foreach ($form['questions'] as $q) {
                            // $question = new Question();
                            $question = Question::updateOrCreate(
                                ['question_uid' => $q['id']],
                                [
                                    'question' => $q['question'],
                                    'description' => $q['description'],
                                    'form_id' => $newForm->id,
                                    'section_id' => $section->id,
                                    'question_uid' => $q['id']
                                ]
                            );


                            /* if ($question->save()) {
                            } */
                            $answer = new Answer();

                            $answer->type = $q['answer']['type'];
                            $answer->structure = json_encode($q['answer']['structure']);
                            $answer->question_id = $question->id;
                            $answer->save();
                        }
                    }
                }
            } else {
                foreach ($form['questions'] as $q) {
                    // $question = new Question();
                    $question = Question::updateOrCreate(
                        ['question_uid' => $q['id']],
                        [
                            'question' => $q['q'],
                            'description' => $q['description'],
                            'form_id' => $newForm->id,
                            // 'section_id' => $section->id,
                            'question_uid' => $q['id']
                        ]
                    );


                    /* if ($question->save()) {
                            } */
                    $answer = new Answer();

                    $answer->type = $q['answer']['type'];
                    $answer->structure = json_encode($q['answer']['structure']);
                    $answer->question_id = $question->id;
                    $answer->save();
                }
            }
            DB::commit();
            return redirect()->back();
        } catch (\Throwable $th) {
            DB::rollBack();
            return redirect()->back()->withErrors(['error' => $th->getMessage()]);
        }
    }

    function preview(Request $request)
    {

        $form_uid = $request->query('form_uid');
        $formDetail = Form::where("form_uid", $form_uid)->first(['id', 'form_uid', 'name', 'description', 'published', 'status', 'begin_date', 'end_date']);


        $sections = Section::where('form_id', $formDetail['id'])->get(['id', 'name', 'section_uid', 'form_id']);

        $questions = Question::where('form_id', $formDetail['id'])->get(['id', 'question_uid', 'question', 'description', 'form_id', 'section_id'])->map(function ($question) {
            $answer = Answer::where('question_id', $question['id'])->first(['id', 'type', 'structure', 'question_id']);
            $answer['structure'] = json_decode($answer['structure']);

            $question['answer'] = $answer;
            return $question;
        });

        if (count(Section::where('form_id', $formDetail['id'])->get(['id', 'name', 'section_uid', 'form_id'])) > 0) {
            $sections = $sections->map(function ($section) use ($questions) {
                $section['questions'] = $questions->where('section_id', $section['id']);
                return $section;
            });
        } else {
            $sections = [];
        }


        $form = ['form' => $formDetail, 'sections' => $sections, 'questions' => $questions];

        return Inertia::render('Preview/Preview', ['form' => $form]);
    }
}

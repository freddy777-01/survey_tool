import React, { useMemo, useState } from "react";
import Layout from "@/Pages/Layout";
import { Button } from "@/Components/ui/button";
import { makeApiRequest } from "@/utilities/api";

export default function Attend({ form }) {
    const { main, sections, questions } = form;
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [resultQuestion, setResultQuestion] = useState(questions);

    // Debug logging
    /* console.log("Attend component loaded with form:", form);
    console.log("Main form data:", main); */
    console.log("Sections:", sections);
    console.log("Questions:", questions);

    useEffect(() => {
        setResultQuestion(questions);
    }, [questions]);

    const setAnswer = (questionId, value) => {
        /* console.log("Setting answer for question", questionId, "to:", value);
        console.log("Current answers state:", answers); */
        setAnswers((prev) => {
            const newAnswers = { ...prev, [questionId]: value };
            // console.log("New answers state:", newAnswers);
            return newAnswers;
        });
    };

    // Helper function to find which section a question belongs to
    const getQuestionSection = (questionId) => {
        return sections.find((section) =>
            section.questions.some((q) => q.id === questionId)
        );
    };

    const submit = async () => {
        if (Object.keys(answers).length === 0) {
            alert("Please answer at least one question before submitting.");
            return;
        }

        console.log("Submitting answers:", answers);
        console.log("Form UID:", main.form_uid);

        setIsSubmitting(true);
        const payload = {
            form_uid: main.form_uid,
            answers,
        };

        try {
            const res = await makeApiRequest("/api/surveys/submit", payload);

            if (res.ok) {
                const data = await res.json();
                console.log("Submission successful:", data);

                // Mark this survey as attended in localStorage
                const attendedSurveys = JSON.parse(
                    localStorage.getItem("attendedSurveys") || "[]"
                );
                if (!attendedSurveys.includes(main.form_uid)) {
                    attendedSurveys.push(main.form_uid);
                    localStorage.setItem(
                        "attendedSurveys",
                        JSON.stringify(attendedSurveys)
                    );
                }

                setSubmitted(true);
                alert("Thank you for participating in this survey!");
            } else {
                const errorData = await res.json();
                console.error("Submission failed:", errorData);
                alert(
                    errorData.message || "Submission failed. Please try again."
                );
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert(
                "Submission failed. Please check your connection and try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto text-center py-12">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-8">
                        <h2 className="text-2xl font-bold text-green-800 mb-4">
                            Thank You!
                        </h2>
                        <p className="text-green-700 mb-6">
                            Your response has been submitted successfully. We
                            appreciate your participation.
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => window.close()}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    const SectionBlock = ({ section }) => (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-gray-200">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                {section.name}
            </h3>
            <div className="space-y-6">
                {section.questions.map((q) => (
                    <div
                        key={q.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                        <p className="font-medium mb-3 text-gray-800">
                            {q.question}
                        </p>

                        {q.answer?.type === "multiple_choice" &&
                            q.answer?.structure && (
                                <div className="space-y-2">
                                    {console.log(
                                        "Rendering multiple choice for question:",
                                        q.id
                                    )}
                                    {console.log(
                                        "Answer structure:",
                                        q.answer.structure
                                    )}
                                    {q.answer.structure.map((opt) => (
                                        <label
                                            key={opt.id || opt.value}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name={`q_${q.id}`}
                                                value={opt.value}
                                                onChange={(e) => {
                                                    setAnswer(
                                                        q.id,
                                                        e.target.value
                                                    );
                                                }}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span className="text-gray-700">
                                                {opt.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        {q.answer?.type === "check_box" &&
                            q.answer?.structure && (
                                <div className="space-y-2">
                                    {console.log(
                                        "Rendering checkbox for question:",
                                        q.id
                                    )}
                                    {console.log(
                                        "Answer structure:",
                                        q.answer.structure
                                    )}
                                    {q.answer.structure.map((opt) => (
                                        <label
                                            key={opt.id || opt.value}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                value={opt.value}
                                                onChange={(e) => {
                                                    /* console.log(
                                                        "Checkbox clicked:",
                                                        e.target.value,
                                                        "checked:",
                                                        e.target.checked
                                                    ); */
                                                    const current =
                                                        Array.isArray(
                                                            answers[q.id]
                                                        )
                                                            ? answers[q.id]
                                                            : [];
                                                    if (e.target.checked)
                                                        setAnswer(q.id, [
                                                            ...current,
                                                            opt.value,
                                                        ]);
                                                    else
                                                        setAnswer(
                                                            q.id,
                                                            current.filter(
                                                                (v) =>
                                                                    v !==
                                                                    opt.value
                                                            )
                                                        );
                                                }}
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span className="text-gray-700">
                                                {opt.value}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        {q.answer?.type === "written" && (
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={4}
                                placeholder="Please provide your answer..."
                                onChange={(e) =>
                                    setAnswer(q.id, e.target.value)
                                }
                            />
                        )}
                        {q.answer?.type === "yes_no" && (
                            <div className="flex gap-6">
                                {["Yes", "No"].map((opt) => (
                                    <label
                                        key={opt}
                                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name={`q_${q.id}`}
                                            value={opt}
                                            onChange={(e) => {
                                                /* console.log(
                                                    "Yes/No radio clicked:",
                                                    e.target.value
                                                ); */
                                                setAnswer(q.id, e.target.value);
                                            }}
                                            className="w-4 h-4 text-blue-600"
                                        />
                                        <span className="text-gray-700">
                                            {opt}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                        {(!q.answer || !q.answer.type) && (
                            <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
                                <p>
                                    Error: This question has no answer structure
                                    defined.
                                </p>
                                <p>Question ID: {q.id}</p>
                                <p>Answer: {JSON.stringify(q.answer)}</p>

                                {/* Fallback input for questions without structure */}
                                <div className="mt-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Your Answer:
                                    </label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={3}
                                        placeholder="Please provide your answer..."
                                        onChange={(e) => {
                                            /* console.log(
                                                "Fallback textarea changed:",
                                                e.target.value
                                            ); */
                                            setAnswer(q.id, e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const QuestionBlock = ({ question }) => {
        const questionSection = getQuestionSection(question.id);

        return (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mb-4">
                <div className="flex justify-between items-start mb-3">
                    <p className="font-medium text-gray-800 flex-1">
                        {question.question}
                    </p>
                    {questionSection && (
                        <div className="ml-4 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md font-medium">
                            {questionSection.name === ""
                                ? `Section ${questionSection.number}`
                                : questionSection.name}
                        </div>
                    )}
                </div>

                {question.answer?.type === "multiple_choice" &&
                    question.answer?.structure && (
                        <div className="space-y-2">
                            {question.answer.structure.map((opt) => (
                                <label
                                    key={opt.id || opt.value}
                                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name={`q_${question.id}`}
                                        value={opt.value}
                                        onChange={(e) => {
                                            setAnswer(
                                                question.id,
                                                e.target.value
                                            );
                                        }}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-gray-700">
                                        {opt.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                {question.answer?.type === "check_box" &&
                    question.answer?.structure && (
                        <div className="space-y-2">
                            {question.answer.structure.map((opt) => (
                                <label
                                    key={opt.id || opt.value}
                                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        value={opt.value}
                                        onChange={(e) => {
                                            const current = Array.isArray(
                                                answers[question.id]
                                            )
                                                ? answers[question.id]
                                                : [];
                                            if (e.target.checked)
                                                setAnswer(question.id, [
                                                    ...current,
                                                    opt.value,
                                                ]);
                                            else
                                                setAnswer(
                                                    question.id,
                                                    current.filter(
                                                        (v) => v !== opt.value
                                                    )
                                                );
                                        }}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-gray-700">
                                        {opt.value}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                {question.answer?.type === "written" && (
                    <textarea
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        placeholder="Please provide your answer..."
                        onChange={(e) => setAnswer(question.id, e.target.value)}
                    />
                )}
                {question.answer?.type === "yes_no" && (
                    <div className="flex gap-6">
                        {["Yes", "No"].map((opt) => (
                            <label
                                key={opt}
                                className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                            >
                                <input
                                    type="radio"
                                    name={`q_${question.id}`}
                                    value={opt}
                                    onChange={(e) => {
                                        setAnswer(question.id, e.target.value);
                                    }}
                                    className="w-4 h-4 text-blue-600"
                                />
                                <span className="text-gray-700">{opt}</span>
                            </label>
                        ))}
                    </div>
                )}
                {(!question.answer || !question.answer.type) && (
                    <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
                        <p>
                            Error: This question has no answer structure
                            defined.
                        </p>
                        <p>Question ID: {question.id}</p>
                        <p>Answer: {JSON.stringify(question.answer)}</p>

                        <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Answer:
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows={3}
                                placeholder="Please provide your answer..."
                                onChange={(e) => {
                                    setAnswer(question.id, e.target.value);
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto border w-[90%]">
                <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        {main.name}
                    </h2>
                    <p className="text-gray-600 text-lg">{main.description}</p>
                </div>

                {sections.length > 0 ? (
                    sections.map((section) => (
                        <SectionBlock key={section.id} section={section} />
                    ))
                ) : (
                    <div className="space-y-4">
                        {questions.map((question) => (
                            <QuestionBlock
                                key={question.id}
                                question={question}
                            />
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center mt-8 p-4 bg-gray-50 rounded-lg border">
                    <div className="text-sm text-gray-600">
                        {Object.keys(answers).length} of {questions.length}{" "}
                        questions answered
                    </div>
                    <Button
                        variant="default"
                        size="lg"
                        className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700 text-white"
                        onClick={submit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Survey"}
                    </Button>
                </div>
            </div>
        </Layout>
    );
}

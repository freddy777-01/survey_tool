import React, { useEffect, useMemo, useState } from "react";
import Layout from "@/Pages/Layout";
import { Button } from "@/Components/ui/button";
import { makeApiRequest } from "@/utilities/api";
import { router } from "@inertiajs/react";

const TextAreaWithFocus = ({
    question_uid,
    structure_id,
    initialValue,
    onAnswerChange,
}) => {
    const [localValue, setLocalValue] = useState(initialValue);

    useEffect(() => {
        setLocalValue(initialValue);
    }, [initialValue]);

    const handleChange = (e) => {
        setLocalValue(e.target.value);
    };

    const handleBlur = () => {
        onAnswerChange(question_uid, localValue, structure_id, "written");
    };

    return (
        <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Please provide your answer..."
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );
};

export default function Attend({ form }) {
    const { main, sections, questions } = form;
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showThankYouModal, setShowThankYouModal] = useState(false);
    const [resultQuestion, setResultQuestion] = useState(questions);

    // Debug logging
    /* console.log("Attend component loaded with form:", form);
    console.log("Main form data:", main); */
    // console.log("Sections:", sections);
    // console.log("Questions:", questions);

    useEffect(() => {
        setResultQuestion(questions);

        const answersSlot = {};
        questions.forEach((q) => {
            if (q.answer.type === "likert_scale") {
                // Check if it's table format (has statements and options) or simple format
                if (
                    q.answer.structure &&
                    q.answer.structure.statements &&
                    q.answer.structure.options
                ) {
                    // Table likert scale - initialize with empty object
                    answersSlot[q.question_uid] = {
                        name: q.answer.type,
                    };
                } else if (Array.isArray(q.answer.structure)) {
                    // Simple likert scale - initialize with empty object
                    answersSlot[q.question_uid] = {
                        name: q.answer.type,
                        value: "",
                    };
                } else {
                    // Fallback for simple likert scale
                    answersSlot[q.question_uid] = {
                        name: q.answer.type,
                        value: "",
                    };
                }
            } else if (Array.isArray(q.answer.structure)) {
                answersSlot[q.question_uid] = q.answer.structure.map(
                    (structure) => ({
                        structureId: structure.id,
                        name: q.answer.type,
                        value: "",
                        checked: false,
                    })
                );
            } else {
                answersSlot[q.question_uid] = {
                    structureId: q.answer.structure?.id,
                    name: q.answer.type,
                    value: q.answer.structure?.value || "",
                    checked: q.answer.structure?.checked || false,
                };
            }
        });
        setAnswers(answersSlot);
        // console.log("Initialized answers:", answersSlot);
    }, [questions]);

    const setAnswer = (question_uid, value, structureId, type) => {
        setAnswers((prev) => {
            if (type === "check_box") {
                // For checkbox questions, update the specific array element
                const currentAnswers = prev[question_uid] || [];
                const updatedAnswers = currentAnswers.map((answer) =>
                    answer.structureId === structureId
                        ? { ...answer, checked: !answer.checked, value: value }
                        : answer
                );
                return { ...prev, [question_uid]: updatedAnswers };
            } else if (type === "multiple_choice") {
                // For multiple choice questions, set only the selected option to true, others to false
                const currentAnswers = prev[question_uid] || [];
                const updatedAnswers = currentAnswers.map((answer) => ({
                    ...answer,
                    checked: answer.structureId === structureId,
                    value: answer.structureId === structureId ? value : "",
                }));
                return { ...prev, [question_uid]: updatedAnswers };
            } else if (type === "likert_scale") {
                // For likert scale questions, check if it's table or simple format
                const currentAnswers = prev[question_uid] || {};

                // If structureId is a statement ID (table format), store per statement
                if (structureId && structureId.toString().length > 10) {
                    // Likely a timestamp ID
                    return {
                        ...prev,
                        [question_uid]: {
                            ...currentAnswers,
                            [structureId]: value, // structureId is the statement ID
                            name: type,
                        },
                    };
                } else {
                    // Simple likert scale - single value
                    return {
                        ...prev,
                        [question_uid]: {
                            value: value,
                            name: type,
                        },
                    };
                }
            } else {
                // For other question types, update the single object
                return {
                    ...prev,
                    [question_uid]: {
                        structureId: structureId,
                        name: type,
                        value: value,
                        checked: true,
                    },
                };
            }
        });
    };

    // Helper function to find which section a question belongs to
    const getQuestionSection = (questionId) => {
        return sections.find((section) =>
            section.questions.some((q) => q.id === questionId)
        );
    };

    const submit = async () => {
        // Check if any questions have been answered
        const answeredQuestions = Object.keys(answers).filter(
            (question_uid) => {
                const answer = answers[question_uid];
                if (Array.isArray(answer)) {
                    return answer.some((item) => item.checked);
                } else if (answer.name === "likert_scale") {
                    // For likert scale, check if it has any answers
                    if (answer.value) {
                        return true; // Simple likert scale has a value
                    } else {
                        // Table likert scale - check if any statements are answered
                        return Object.keys(answer).some(
                            (key) => key !== "name" && answer[key]
                        );
                    }
                } else {
                    return answer.value && answer.value.trim() !== "";
                }
            }
        );

        if (answeredQuestions.length === 0) {
            alert("Please answer at least one question before submitting.");
            return;
        }

        // Transform answers to the expected format
        const transformedAnswers = {};
        Object.keys(answers).forEach((question_uid) => {
            const answer = answers[question_uid];
            if (Array.isArray(answer)) {
                // For checkbox questions, collect all checked values
                const checkedValues = answer
                    .filter((item) => item.checked)
                    .map((item) => item.value);
                if (checkedValues.length > 0) {
                    transformedAnswers[question_uid] = checkedValues;
                }
            } else if (answer.name === "likert_scale") {
                // For likert scale questions, check if it's table or simple format
                if (answer.value) {
                    // Simple likert scale - single value
                    transformedAnswers[question_uid] = answer.value;
                } else {
                    // Table likert scale - collect all statement answers
                    const statementAnswers = {};
                    Object.keys(answer).forEach((key) => {
                        if (key !== "name" && answer[key]) {
                            statementAnswers[key] = answer[key];
                        }
                    });
                    if (Object.keys(statementAnswers).length > 0) {
                        transformedAnswers[question_uid] = statementAnswers;
                    }
                }
            } else {
                // For other question types, use the single value if not empty
                if (answer.value && answer.value.trim() !== "") {
                    transformedAnswers[question_uid] = answer.value;
                }
            }
        });

        console.log("Submitting answers:", transformedAnswers);
        console.log("Form UID:", main.form_uid);

        setIsSubmitting(true);
        const payload = {
            form_uid: main.form_uid,
            answers: transformedAnswers,
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
                setShowThankYouModal(true);
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
                            onClick={() => router.visit("/")}
                            className="p-1 px-2 bg-blue-400 hover:bg-blue-500 text-white"
                        >
                            Back to Dashboard
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
                {section.questions.map((q, questionIndex) => (
                    <div
                        key={q.question_uid}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                    >
                        <p className="font-medium mb-3 text-gray-800">
                            {q.question}
                        </p>

                        {q.answer?.type === "multiple_choice" &&
                            q.answer?.structure && (
                                <div className="space-y-2">
                                    {q.answer.structure.map((opt, i) => (
                                        <label
                                            key={opt.id || opt.value}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                                        >
                                            <input
                                                type="radio"
                                                name={`q_${q.question_uid}`}
                                                value={opt.value}
                                                checked={
                                                    answers[q.question_uid]?.[i]
                                                        ?.checked || false
                                                }
                                                onChange={(e) => {
                                                    setAnswer(
                                                        q.question_uid,
                                                        e.target.value,
                                                        opt.id,
                                                        "multiple_choice"
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
                        {q.answer?.type === "check_box" &&
                            q.answer?.structure && (
                                <div className="space-y-2">
                                    {q.answer.structure.map((opt, i) => (
                                        <label
                                            key={opt.id || opt.value}
                                            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                                        >
                                            <input
                                                type="checkbox"
                                                value={opt.value}
                                                checked={
                                                    answers[q.question_uid]?.[i]
                                                        ?.checked || false
                                                }
                                                onChange={(e) => {
                                                    setAnswer(
                                                        q.question_uid,
                                                        opt.value,
                                                        opt.id,
                                                        "check_box"
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
                            <TextAreaWithFocus
                                question_uid={q.question_uid}
                                structure_id={q.answer.structure.id}
                                initialValue={
                                    answers[q.question_uid]?.value || ""
                                }
                                onAnswerChange={setAnswer}
                            />
                        )}
                        {q.answer?.type === "yes_no" && (
                            <div className="flex gap-6">
                                {["Yes", "No"].map((opt, i) => (
                                    <label
                                        key={opt}
                                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name={`q_${q.question_uid}`}
                                            value={opt}
                                            checked={
                                                answers[q.question_uid]
                                                    ?.value === opt
                                            }
                                            onChange={(e) => {
                                                setAnswer(
                                                    q.question_uid,
                                                    e.target.value,
                                                    null,
                                                    "yes_no"
                                                );
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
                                <p>Question ID: {q.question_uid}</p>
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
                                            setAnswer(
                                                q.question_uid,
                                                e.target.value,
                                                null,
                                                "written"
                                            );
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
                            {question.answer.structure.map((opt, i) => (
                                <label
                                    key={opt.id || opt.value}
                                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name={`q_${question.question_uid}`}
                                        value={opt.value}
                                        checked={
                                            answers[question.question_uid]?.[i]
                                                ?.checked || false
                                        }
                                        onChange={(e) => {
                                            setAnswer(
                                                question.question_uid,
                                                e.target.value,
                                                opt.id,
                                                "multiple_choice"
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
                {question.answer?.type === "check_box" &&
                    question.answer?.structure && (
                        <div className="space-y-2">
                            {question.answer.structure.map((opt, i) => (
                                <label
                                    key={opt.id || opt.value}
                                    className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        value={opt.value}
                                        checked={
                                            answers[question.question_uid]?.[i]
                                                ?.checked || false
                                        }
                                        onChange={(e) => {
                                            setAnswer(
                                                question.question_uid,
                                                opt.value,
                                                opt.id,
                                                "check_box"
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
                    <TextAreaWithFocus
                        question_uid={question.question_uid}
                        structure_id={question.answer.structure.id}
                        initialValue={
                            answers[question.question_uid]?.value || ""
                        }
                        onAnswerChange={setAnswer}
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
                {question.answer?.type === "likert_scale" &&
                    question.answer.structure && (
                        <>
                            {/* Table Likert Scale */}
                            {question.answer.structure.statements &&
                                question.answer.structure.options && (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border border-gray-300">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                                                        Statement
                                                    </th>
                                                    {question.answer.structure.options.map(
                                                        (option) => (
                                                            <th
                                                                key={option.id}
                                                                className="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700"
                                                            >
                                                                {option.value}
                                                            </th>
                                                        )
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {question.answer.structure.statements.map(
                                                    (statement, index) => (
                                                        <tr key={statement.id}>
                                                            <td className="border border-gray-300 px-3 py-2 text-sm">
                                                                {index + 1}.{" "}
                                                                {statement.text}
                                                            </td>
                                                            {question.answer.structure.options.map(
                                                                (option) => (
                                                                    <td
                                                                        key={
                                                                            option.id
                                                                        }
                                                                        className="border border-gray-300 px-3 py-2 text-center"
                                                                    >
                                                                        <input
                                                                            type="radio"
                                                                            name={`statement_${statement.id}`}
                                                                            value={
                                                                                option.value
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) => {
                                                                                setAnswer(
                                                                                    question.question_uid,
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                    statement.id,
                                                                                    "likert_scale"
                                                                                );
                                                                            }}
                                                                            className="cursor-pointer h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                                        />
                                                                    </td>
                                                                )
                                                            )}
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                            {/* Simple Likert Scale */}
                            {Array.isArray(question.answer.structure) && (
                                <div className="flex flex-row gap-x-5 items-center p-2 text-sm">
                                    {question.answer.structure.map(
                                        (scale, index) => (
                                            <div
                                                className="flex gap-x-1.5"
                                                key={index}
                                            >
                                                <input
                                                    type="radio"
                                                    value={scale.value}
                                                    name={`q_${question.question_uid}`}
                                                    onChange={(e) => {
                                                        setAnswer(
                                                            question.question_uid,
                                                            e.target.value,
                                                            scale.id,
                                                            "likert_scale"
                                                        );
                                                    }}
                                                    className="cursor-pointer h-5 w-5 border focus:outline-none border-slate-300 transition-all checked:bg-blue-300 focus:ring-1 rounded-md p-1.5"
                                                />
                                                <label className="hover:cursor-pointer">
                                                    {scale.value}
                                                </label>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </>
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
        <>
            {/* Thank You Modal */}
            {showThankYouModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
                        <div className="mb-6">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg
                                    className="h-6 w-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Thank You!
                            </h3>
                            <p className="text-sm text-gray-500">
                                Your response has been submitted successfully.
                                We appreciate your participation.
                            </p>
                        </div>
                        <div className="flex gap-3 justify-center">
                            <Button
                                variant="outline"
                                onClick={() => router.visit("/")}
                            >
                                Back to Dashboard
                            </Button>
                            <Button onClick={() => setShowThankYouModal(false)}>
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <Layout>
                <div className="max-w-4xl mx-auto w-[90%]">
                    <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {main.name}
                        </h2>
                        <p className="text-gray-600 text-lg">
                            {main.description}
                        </p>
                    </div>

                    {sections.length > 0 ? (
                        sections.map((section) => (
                            <SectionBlock key={section.id} section={section} />
                        ))
                    ) : (
                        <div className="space-y-4">
                            {questions.map((question) => (
                                <QuestionBlock
                                    key={question.question_uid}
                                    question={question}
                                />
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-8 p-4 bg-gray-50 rounded-lg border">
                        <div className="text-sm text-gray-600">
                            {
                                Object.keys(answers).filter((question_uid) => {
                                    const answer = answers[question_uid];
                                    if (Array.isArray(answer)) {
                                        return answer.some(
                                            (item) => item.checked
                                        );
                                    } else if (answer.name === "likert_scale") {
                                        // For likert scale, check if it has any answers
                                        if (answer.value) {
                                            return true; // Simple likert scale has a value
                                        } else {
                                            // Table likert scale - check if any statements are answered
                                            return Object.keys(answer).some(
                                                (key) =>
                                                    key !== "name" &&
                                                    answer[key]
                                            );
                                        }
                                    } else {
                                        return (
                                            answer.value &&
                                            answer.value.trim() !== ""
                                        );
                                    }
                                }).length
                            }{" "}
                            of {questions.length} questions answered
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
        </>
    );
}

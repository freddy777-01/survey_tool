import React, { useEffect, useMemo, useState, useRef } from "react";
import Layout from "@/Pages/Layout";
import { Button } from "@/Components/ui/button";
import { makeApiRequest } from "@/utilities/api";
import { router } from "@inertiajs/react";
import ResumeDialog from "@/Components/ResumeDialog";

// Component for Multiple Choice questions
const MultipleChoiceComponent = ({
    question,
    answers,
    setAnswer,
    questionIndex,
}) => {
    return (
        <div className="space-y-2">
            {question.answer.structure.map((opt, i) => {
                const inputId = `radio_${question.question_uid}_${opt.id || i}`;
                return (
                    <label
                        key={opt.id || opt.value}
                        htmlFor={inputId}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl cursor-pointer"
                    >
                        <input
                            id={inputId}
                            type="radio"
                            name={`radio_${question.question_uid}`}
                            value={opt.value}
                            checked={
                                answers[question.question_uid]?.[i]?.checked ||
                                false
                            }
                            onChange={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                setAnswer(
                                    question.question_uid,
                                    event.target.value,
                                    opt.id,
                                    "multiple_choice"
                                );
                            }}
                            onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                            }}
                            className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{opt.value}</span>
                    </label>
                );
            })}
        </div>
    );
};

// Component for Checkbox questions
const CheckboxComponent = ({ question, answers, setAnswer, questionIndex }) => {
    return (
        <div className="space-y-2">
            {question.answer.structure.map((opt, i) => {
                const inputId = `checkbox_${question.question_uid}_${
                    opt.id || i
                }`;
                return (
                    <label
                        key={opt.id || opt.value}
                        htmlFor={inputId}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl cursor-pointer"
                    >
                        <input
                            id={inputId}
                            type="checkbox"
                            value={opt.value}
                            checked={
                                answers[question.question_uid]?.[i]?.checked ||
                                false
                            }
                            onChange={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setAnswer(
                                    question.question_uid,
                                    opt.value,
                                    opt.id,
                                    "check_box"
                                );
                            }}
                            className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{opt.value}</span>
                    </label>
                );
            })}
        </div>
    );
};

// Component for Written/Text questions
const WrittenComponent = ({ question, answers, setAnswer, questionIndex }) => {
    const [localValue, setLocalValue] = useState(
        answers[question.question_uid]?.value || ""
    );

    useEffect(() => {
        setLocalValue(answers[question.question_uid]?.value || "");
    }, [answers[question.question_uid]?.value]);

    const handleChange = (e) => {
        setLocalValue(e.target.value);
    };

    const handleBlur = () => {
        setAnswer(
            question.question_uid,
            localValue,
            question.answer.structure.id,
            "written"
        );
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

// Component for Yes/No questions
const YesNoComponent = ({ question, answers, setAnswer, questionIndex }) => {
    return (
        <div className="flex gap-6">
            {["Yes", "No"].map((opt, i) => {
                const inputId = `radio_${
                    question.question_uid
                }_${opt.toLowerCase()}`;
                return (
                    <label
                        key={opt}
                        htmlFor={inputId}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-xl cursor-pointer"
                    >
                        <input
                            id={inputId}
                            type="radio"
                            name={`radio_${question.question_uid}`}
                            value={opt}
                            checked={
                                answers[question.question_uid]?.value === opt
                            }
                            onChange={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setAnswer(
                                    question.question_uid,
                                    e.target.value,
                                    null,
                                    "yes_no"
                                );
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">{opt}</span>
                    </label>
                );
            })}
        </div>
    );
};

// Component for Table Likert Scale questions
const TableLikertScaleComponent = ({
    question,
    answers,
    setAnswer,
    questionIndex,
}) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                            Statement
                        </th>
                        {question.answer.structure.options.map((option) => (
                            <th
                                key={option.id}
                                className="border border-gray-300 px-3 py-2 text-center text-sm font-medium text-gray-700"
                            >
                                {option.value}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {question.answer.structure.statements.map(
                        (statement, index) => (
                            <tr key={statement.id}>
                                <td className="border border-gray-300 px-3 py-2 text-sm">
                                    {index + 1}. {statement.text}
                                </td>
                                {question.answer.structure.options.map(
                                    (option) => (
                                        <td
                                            key={option.id}
                                            className="border border-gray-300 px-3 py-2 text-center"
                                        >
                                            <input
                                                id={`radio_${question.question_uid}_${statement.id}_${option.id}`}
                                                type="radio"
                                                name={`radio_${question.question_uid}_${statement.id}`}
                                                value={option.value}
                                                checked={
                                                    answers[
                                                        question.question_uid
                                                    ]?.[statement.id] ===
                                                    option.value
                                                }
                                                onChange={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setAnswer(
                                                        question.question_uid,
                                                        e.target.value,
                                                        statement.id,
                                                        "likert_scale"
                                                    );
                                                }}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
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
    );
};

// Component for Simple Likert Scale questions
const SimpleLikertScaleComponent = ({
    question,
    answers,
    setAnswer,
    questionIndex,
}) => {
    return (
        <div className="flex flex-row gap-x-5 items-center p-2 text-sm">
            {question.answer.structure.map((scale, index) => {
                const inputId = `radio_${question.question_uid}_${
                    scale.id || index
                }`;
                return (
                    <div className="flex gap-x-1.5" key={index}>
                        <input
                            id={inputId}
                            type="radio"
                            value={scale.value}
                            name={`radio_${question.question_uid}`}
                            checked={
                                answers[question.question_uid]?.value ===
                                scale.value
                            }
                            onChange={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setAnswer(
                                    question.question_uid,
                                    e.target.value,
                                    scale.id,
                                    "likert_scale"
                                );
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="cursor-pointer h-5 w-5 border focus:outline-none border-slate-300 transition-all checked:bg-blue-300 focus:ring-1 rounded-md p-1.5"
                        />
                        <label
                            htmlFor={inputId}
                            className="hover:cursor-pointer"
                        >
                            {scale.value}
                        </label>
                    </div>
                );
            })}
        </div>
    );
};

// Main Question Component that renders the appropriate component based on type
const QuestionComponent = ({ question, answers, setAnswer, questionIndex }) => {
    const renderAnswerComponent = () => {
        switch (question.answer?.type) {
            case "multiple_choice":
                return (
                    <MultipleChoiceComponent
                        question={question}
                        answers={answers}
                        setAnswer={setAnswer}
                        questionIndex={questionIndex}
                    />
                );
            case "check_box":
                return (
                    <CheckboxComponent
                        question={question}
                        answers={answers}
                        setAnswer={setAnswer}
                        questionIndex={questionIndex}
                    />
                );
            case "written":
                return (
                    <WrittenComponent
                        question={question}
                        answers={answers}
                        setAnswer={setAnswer}
                        questionIndex={questionIndex}
                    />
                );
            case "yes_no":
                return (
                    <YesNoComponent
                        question={question}
                        answers={answers}
                        setAnswer={setAnswer}
                        questionIndex={questionIndex}
                    />
                );
            case "likert_scale":
                if (
                    question.answer.structure &&
                    question.answer.structure.statements
                ) {
                    return (
                        <TableLikertScaleComponent
                            question={question}
                            answers={answers}
                            setAnswer={setAnswer}
                            questionIndex={questionIndex}
                        />
                    );
                } else {
                    return (
                        <SimpleLikertScaleComponent
                            question={question}
                            answers={answers}
                            setAnswer={setAnswer}
                            questionIndex={questionIndex}
                        />
                    );
                }
            default:
                return (
                    <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
                        <p>
                            Error: This question has no answer structure
                            defined.
                        </p>
                        <p>Question ID: {question.question_uid}</p>
                        <p>Answer: {JSON.stringify(question.answer)}</p>
                    </div>
                );
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
                {/* Question Number */}
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold shadow-none">
                    {questionIndex + 1}
                </div>

                {/* Question Content */}
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {question.question}
                    </h3>

                    {/* Answer Component */}
                    {renderAnswerComponent()}
                </div>
            </div>
        </div>
    );
};

export default function Attend({ form }) {
    const { main, sections, questions } = form;
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showThankYouModal, setShowThankYouModal] = useState(false);
    const [resultQuestion, setResultQuestion] = useState(questions);
    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollPositionRef = useRef(0);

    // Resume functionality states
    const [showResumeDialog, setShowResumeDialog] = useState(false);
    const [existingAnswers, setExistingAnswers] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [isCheckingExisting, setIsCheckingExisting] = useState(true);

    // console.log(form);
    // Prevent form submission and scrolling
    useEffect(() => {
        // Prevent scroll restoration
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }

        const handleFormSubmit = (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        };

        const handleKeyDown = (e) => {
            if (e.key === "Enter" && e.target.type !== "textarea") {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        };

        const handleScroll = () => {
            scrollPositionRef.current = window.scrollY;
        };

        document.addEventListener("submit", handleFormSubmit, true);
        document.addEventListener("keydown", handleKeyDown, true);
        window.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("submit", handleFormSubmit, true);
            document.removeEventListener("keydown", handleKeyDown, true);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Restore scroll position after state updates - only when answers change
    useEffect(() => {
        const timer = setTimeout(() => {
            if (scrollPositionRef.current > 0) {
                window.scrollTo(0, scrollPositionRef.current);
            }
        }, 0);

        return () => clearTimeout(timer);
    }, [answers]);

    // Check for existing response on component mount
    useEffect(() => {
        const checkExistingResponse = async () => {
            try {
                const response = await makeApiRequest(
                    `/api/surveys/existing-response?form_uid=${main.form_uid}`
                );
                const data = await response.json();

                if (data.has_existing_response) {
                    setExistingAnswers(data.answers);
                    setLastUpdated(data.last_updated);
                    setShowResumeDialog(true);
                }
            } catch (error) {
                console.error("Error checking existing response:", error);
            } finally {
                setIsCheckingExisting(false);
            }
        };

        checkExistingResponse();
    }, [main.form_uid]);

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
    }, []); // Only run once on mount

    const setAnswer = (question_uid, value, structureId, type) => {
        // Store current scroll position and active element before state update
        const currentScroll = window.scrollY;
        const activeElement = document.activeElement;
        const activeElementId = activeElement?.id;

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

                // Check if this is a table Likert scale by looking at the question structure
                // For table Likert scales, we need to check if the question has statements
                const question = questions.find(
                    (q) => q.question_uid === question_uid
                );
                if (question && question.answer?.structure?.statements) {
                    // Table Likert scale - store per statement
                    const newAnswer = {
                        ...prev,
                        [question_uid]: {
                            ...currentAnswers,
                            [structureId]: value, // structureId is the statement ID
                            name: type,
                        },
                    };

                    return newAnswer;
                } else {
                    // Simple likert scale - single value
                    const newAnswer = {
                        ...prev,
                        [question_uid]: {
                            value: value,
                            name: type,
                        },
                    };

                    return newAnswer;
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

        // Restore scroll position and focus after state update
        setTimeout(() => {
            window.scrollTo(0, currentScroll);
            // Try to restore focus to the same element by ID
            if (activeElementId) {
                const elementToFocus = document.getElementById(activeElementId);
                if (elementToFocus && elementToFocus.focus) {
                    elementToFocus.focus();
                }
            }
        }, 0);
    };

    // Helper function to find which section a question belongs to
    const getQuestionSection = (questionId) => {
        return sections.find((section) =>
            section.questions.some((q) => q.id === questionId)
        );
    };

    // Transform existing answer to match current format
    const transformExistingAnswer = (question, existingValue) => {
        if (question.answer.type === "likert_scale") {
            if (
                question.answer.structure &&
                question.answer.structure.statements
            ) {
                // Table likert scale
                return {
                    name: question.answer.type,
                    ...existingValue,
                };
            } else {
                // Simple likert scale
                return {
                    name: question.answer.type,
                    value: existingValue,
                };
            }
        } else if (Array.isArray(question.answer.structure)) {
            // Multiple choice or checkbox
            return question.answer.structure.map((structure) => {
                const isChecked = Array.isArray(existingValue)
                    ? existingValue.includes(structure.value)
                    : existingValue === structure.value;

                return {
                    structureId: structure.id,
                    name: question.answer.type,
                    value: structure.value,
                    checked: isChecked,
                };
            });
        } else {
            // Written, yes_no, or other single value types
            return {
                structureId: question.answer.structure?.id,
                name: question.answer.type,
                value: existingValue,
                checked: true,
            };
        }
    };

    // Load existing answers into the form
    const loadExistingAnswers = () => {
        if (!existingAnswers) return;

        setAnswers((prev) => {
            const updatedAnswers = { ...prev };

            Object.keys(existingAnswers).forEach((questionUid) => {
                const existingValue = existingAnswers[questionUid];
                const question = questions.find(
                    (q) => q.question_uid === questionUid
                );

                if (question) {
                    updatedAnswers[questionUid] = transformExistingAnswer(
                        question,
                        existingValue
                    );
                }
            });

            return updatedAnswers;
        });

        setShowResumeDialog(false);
    };

    // Start fresh (ignore existing answers)
    const startFresh = () => {
        setShowResumeDialog(false);
        setExistingAnswers(null);
        setLastUpdated(null);
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

        setIsSubmitting(true);
        const payload = {
            form_uid: main.form_uid,
            answers: transformedAnswers,
        };

        try {
            const res = await makeApiRequest("/api/surveys/submit", payload);

            if (res.ok) {
                const data = await res.json();

                // Clear any existing answers state since survey is now completed
                setExistingAnswers(null);
                setLastUpdated(null);

                setSubmitted(true);
                setShowThankYouModal(true);
            } else {
                const errorData = await res.json();
                alert(
                    errorData.message || "Submission failed. Please try again."
                );
            }
        } catch (error) {
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
                    <QuestionComponent
                        key={q.question_uid}
                        question={q}
                        answers={answers}
                        setAnswer={setAnswer}
                        questionIndex={questionIndex}
                    />
                ))}
            </div>
        </div>
    );

    // Show loading state while checking for existing response
    if (isCheckingExisting) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto text-center py-12">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading survey...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <>
            {/* Resume Dialog */}
            <ResumeDialog
                isOpen={showResumeDialog}
                onResume={loadExistingAnswers}
                onStartNew={startFresh}
                lastUpdated={lastUpdated}
            />

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
                <div
                    className="max-w-4xl mx-auto w-[90%]"
                    style={{
                        scrollBehavior: "auto",
                        scrollRestoration: "manual",
                    }}
                    onScroll={(e) => e.stopPropagation()}
                >
                    <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">
                            {main.name}
                        </h2>
                        <p className="text-gray-600 text-lg">
                            {main.description}
                        </p>
                    </div>

                    <div
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        }}
                        onSubmit={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                    >
                        {sections.length > 0 ? (
                            sections.map((section) => (
                                <SectionBlock
                                    key={section.id}
                                    section={section}
                                />
                            ))
                        ) : (
                            <div className="space-y-4">
                                {questions.map((question, index) => (
                                    <QuestionComponent
                                        key={question.question_uid}
                                        question={question}
                                        answers={answers}
                                        setAnswer={setAnswer}
                                        questionIndex={index}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

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

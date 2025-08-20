import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/Components/ui/button";
import {
    FiMove,
    FiCheck,
    FiAlertCircle,
    FiChevronDown,
    FiChevronUp,
} from "react-icons/fi";
import { TbZoomQuestion } from "react-icons/tb";
import { LuGrip } from "react-icons/lu";

const QuestionArranger = ({
    questions,
    onQuestionsReorder,
    onClose,
    onApplyOrder,
    sections = [],
    onAssignQuestionToSection = null,
}) => {
    const [orderedQuestions, setOrderedQuestions] = useState([]);
    const [groupBySection, setGroupBySection] = useState(true);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverItem, setDragOverItem] = useState(null);
    const [expandedSections, setExpandedSections] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        // Show updating state briefly
        setIsUpdating(true);

        // Only initialize if questions exist and are valid
        if (questions && Array.isArray(questions) && questions.length > 0) {
            setOrderedQuestions([...questions]);
        } else {
            setOrderedQuestions([]);
        }

        // Initialize expanded sections only if sections exist
        const initialExpanded = {};
        if (sections && Array.isArray(sections) && sections.length > 0) {
            sections.forEach((section) => {
                if (section && section.section_uid) {
                    initialExpanded[section.section_uid] = true;
                }
            });
        }
        setExpandedSections(initialExpanded);

        // Debug: Log when sections or questions change
        console.log(
            "QuestionArranger: Sections updated:",
            sections?.length || 0
        );
        console.log(
            "QuestionArranger: Questions updated:",
            questions?.length || 0
        );

        // Hide updating state after a brief delay
        setTimeout(() => setIsUpdating(false), 100);
    }, [questions, sections]);

    // Drag and drop handlers
    const handleDragStart = useCallback((e, index) => {
        setDraggedItem(index);
        e.dataTransfer.effectAllowed = "move";
    }, []);

    const handleDragOver = useCallback((e, index) => {
        e.preventDefault();
        setDragOverItem(index);
    }, []);

    const handleDrop = useCallback(
        (e, dropIndex) => {
            e.preventDefault();

            if (draggedItem === null || draggedItem === dropIndex) {
                setDraggedItem(null);
                setDragOverItem(null);
                return;
            }

            const newOrder = [...orderedQuestions];
            const draggedQuestion = newOrder[draggedItem];

            // Remove from original position
            newOrder.splice(draggedItem, 1);

            // Insert at new position
            newOrder.splice(dropIndex, 0, draggedQuestion);

            setOrderedQuestions(newOrder);
            setDraggedItem(null);
            setDragOverItem(null);
        },
        [draggedItem, orderedQuestions]
    );

    const handleDragEnd = useCallback(() => {
        setDraggedItem(null);
        setDragOverItem(null);
    }, []);

    const toggleSection = useCallback((sectionUid) => {
        setExpandedSections((prev) => ({
            ...prev,
            [sectionUid]: !prev[sectionUid],
        }));
    }, []);

    const getSectionName = useCallback(
        (sectionUid) => {
            if (!sectionUid) return "No Section";
            const section = sections.find((s) => s.section_uid === sectionUid);
            return section ? section.name : "No Section";
        },
        [sections]
    );

    const getQuestionTypeIcon = (type) => {
        switch (type) {
            case "multiple_choice":
                return "🔘";
            case "check_box":
                return "☑️";
            case "likert_scale":
                return "📊";
            case "yes_no":
                return "✅";
            case "written":
                return "✏️";
            default:
                return "❓";
        }
    };

    const getQuestionTypeLabel = (type) => {
        switch (type) {
            case "multiple_choice":
                return "Multiple Choice";
            case "check_box":
                return "Checkbox";
            case "likert_scale":
                return "Likert Scale";
            case "yes_no":
                return "Yes/No";
            case "written":
                return "Written";
            default:
                return "Unknown";
        }
    };

    // Group questions by sections when groupBySection is true
    const getGroupedQuestions = useCallback(() => {
        // Early return if no questions
        if (!orderedQuestions || orderedQuestions.length === 0) {
            return {};
        }

        if (!groupBySection) {
            return {
                "All Questions": orderedQuestions.map((q, index) => ({
                    ...q,
                    displayIndex: index,
                })),
            };
        }

        const groups = {};

        // Initialize all sections only if sections exist
        if (sections && Array.isArray(sections)) {
            sections.forEach((section) => {
                if (section && section.name) {
                    groups[section.name] = [];
                }
            });
        }

        // Add a group for questions without sections
        groups["No Section"] = [];

        // Add questions to their sections
        orderedQuestions.forEach((question, index) => {
            if (question && question.question_uid) {
                const sectionName = getSectionName(question.section_uid);
                if (!groups[sectionName]) {
                    groups[sectionName] = [];
                }
                groups[sectionName].push({
                    ...question,
                    displayIndex: index,
                });
            }
        });

        // Only remove "No Section" if it's empty, but keep empty sections for dragging
        if (groups["No Section"] && groups["No Section"].length === 0) {
            delete groups["No Section"];
        }

        // Keep all sections (even empty ones) so users can see them and drag questions into them

        return groups;
    }, [groupBySection, orderedQuestions, sections, getSectionName]);

    const renderQuestionItem = (question, index) => {
        // Early return if question is invalid
        if (!question || !question.question_uid) {
            return null;
        }

        return (
            <div
                key={question.question_uid}
                className={`flex items-center gap-2 p-2 bg-white border rounded-md shadow-sm transition-all duration-200 ${
                    draggedItem === index
                        ? "opacity-50 scale-95 ring-2 ring-blue-500"
                        : dragOverItem === index
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
            >
                {/* Drag Handle */}
                <div className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-400">
                    <LuGrip className="w-3 h-3" />
                </div>
                {/* Question Number */}
                <div className="flex-shrink-0 w-5 h-5 bg-green-100 text-green-600 rounded flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                </div>

                {/* Question Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs">
                            {getQuestionTypeIcon(question.answer?.type)}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-1 py-0.5 rounded">
                            {getQuestionTypeLabel(question.answer?.type)}
                        </span>
                    </div>
                    <h4 className="font-medium text-gray-900 text-xs truncate">
                        {question.question || "Untitled Question"}
                    </h4>
                </div>

                {/* Question Status */}
                <div className="flex-shrink-0">
                    {!question.question?.trim() ? (
                        <div className="flex items-center gap-1 text-orange-600 text-xs">
                            <FiAlertCircle className="w-2 h-2" />
                        </div>
                    ) : (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                            <FiCheck className="w-2 h-2" />
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderSection = useCallback(
        (sectionName, questions, sectionUid = null) => {
            const isExpanded = sectionUid ? expandedSections[sectionUid] : true;
            const questionCount = questions.length;
            const isNoSection = sectionName === "No Section";

            return (
                <div
                    key={`section-${sectionUid || sectionName}`}
                    className="mb-3"
                >
                    <div
                        className={`border border-gray-200 rounded-md p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                            isNoSection
                                ? "bg-orange-50 border-orange-200"
                                : questionCount === 0
                                ? "bg-blue-50 border-blue-200"
                                : "bg-gray-100"
                        } ${
                            dragOverItem === `section-${sectionUid}`
                                ? "border-blue-400 bg-blue-100 ring-2 ring-blue-300"
                                : dragOverItem === `assigned-${sectionUid}`
                                ? "border-green-400 bg-green-100 ring-2 ring-green-300"
                                : ""
                        }`}
                        onClick={() => sectionUid && toggleSection(sectionUid)}
                        onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverItem(`section-${sectionUid}`);
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            if (sectionUid && draggedItem !== null) {
                                // Get the dragged question
                                const draggedQuestion =
                                    orderedQuestions[draggedItem];

                                // Assign the question to this section
                                if (
                                    onAssignQuestionToSection &&
                                    draggedQuestion
                                ) {
                                    onAssignQuestionToSection(
                                        draggedQuestion.question_uid,
                                        sectionUid
                                    );
                                    // Add visual feedback
                                    setDragOverItem(`assigned-${sectionUid}`);
                                    setTimeout(
                                        () => setDragOverItem(null),
                                        500
                                    );
                                }

                                // Find the index where to insert the question in this section
                                const sectionQuestions =
                                    orderedQuestions.filter(
                                        (q) => q.section_uid === sectionUid
                                    );
                                const insertIndex = orderedQuestions.findIndex(
                                    (q) =>
                                        q.question_uid ===
                                        sectionQuestions[0]?.question_uid
                                );
                                const actualIndex =
                                    insertIndex >= 0
                                        ? insertIndex
                                        : orderedQuestions.length;
                                handleDrop(e, actualIndex);
                            }
                            setDragOverItem(null);
                        }}
                        onDragLeave={() => setDragOverItem(null)}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <TbZoomQuestion className="w-4 h-4 text-blue-600" />
                                <h4 className="text-sm font-semibold text-gray-900">
                                    {sectionName}
                                </h4>
                                <span className="text-xs text-gray-500">
                                    ({questionCount})
                                </span>
                                {sectionUid && !isNoSection && (
                                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                        {questionCount === 0
                                            ? "Empty - Drop questions here"
                                            : "Drop questions here"}
                                    </span>
                                )}
                            </div>
                            {sectionUid && !isNoSection && (
                                <div className="flex items-center gap-2">
                                    {isExpanded ? (
                                        <FiChevronUp className="w-3 h-3 text-gray-500" />
                                    ) : (
                                        <FiChevronDown className="w-3 h-3 text-gray-500" />
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="mt-2 space-y-1 pl-3">
                            {questions.length > 0 ? (
                                questions.map((question, index) =>
                                    renderQuestionItem(
                                        question,
                                        question.displayIndex
                                    )
                                )
                            ) : (
                                <div className="text-center py-4 text-gray-500 text-xs border-2 border-dashed border-gray-200 rounded-md bg-gray-50">
                                    <div className="flex items-center justify-center gap-2">
                                        <FiMove className="w-3 h-3" />
                                        <span>
                                            Drag questions here to organize
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
        },
        [
            expandedSections,
            dragOverItem,
            draggedItem,
            orderedQuestions,
            handleDrop,
            toggleSection,
        ]
    );

    // Early return if no questions to prevent DOM manipulation errors
    if (!orderedQuestions || orderedQuestions.length === 0) {
        return (
            <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <FiMove className="w-4 h-4 text-blue-600" />
                            Arrange Questions
                        </h3>
                        <p className="text-gray-600 text-xs mt-1">
                            Drag and drop to reorder questions
                        </p>
                    </div>
                </div>

                {/* Empty State */}
                <div className="text-center py-8">
                    <TbZoomQuestion className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-2">
                        No questions to arrange
                    </p>
                    <p className="text-xs text-gray-500">
                        Add questions to your survey first
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FiMove className="w-4 h-4 text-blue-600" />
                        Arrange Questions
                        {isUpdating && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded animate-pulse">
                                Updating...
                            </span>
                        )}
                    </h3>
                    <p className="text-gray-600 text-xs mt-1">
                        Drag and drop to reorder questions
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGroupBySection(!groupBySection)}
                    className="text-xs px-2 py-1"
                >
                    {groupBySection ? "Show All" : "Group"}
                </Button>
            </div>

            {/* Content */}
            <div
                className={`space-y-3 max-h-96 overflow-y-auto transition-opacity duration-200 ${
                    isUpdating ? "opacity-75" : "opacity-100"
                }`}
            >
                <div>
                    {Object.entries(getGroupedQuestions()).map(
                        ([sectionName, questions]) => {
                            const sectionUid = sections.find(
                                (s) => s.name === sectionName
                            )?.section_uid;
                            return renderSection(
                                sectionName,
                                questions,
                                sectionUid
                            );
                        }
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-600">
                    {orderedQuestions.length} question
                    {orderedQuestions.length !== 1 ? "s" : ""} total
                </div>
                <Button
                    onClick={() => {
                        onApplyOrder(orderedQuestions);
                    }}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                >
                    Apply Order
                </Button>
            </div>
        </div>
    );
};

export default QuestionArranger;

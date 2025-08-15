import React, { useEffect } from "react";
import { FormContext, FormProvider } from "@/utilities/FormProvider";
import { ToastContainer } from "react-toastify";
import Layout from "../Layout";
import MultipleChoice from "../../Components/MultipleChoice";
import Question from "../../Components/Question";
import Written from "../../Components/Written";
import YesNo from "../../Components/YesNo";
import SimpleLikertScale from "../../Components/SimpleLikertScale";
import TableLikertScale from "../../Components/TableLikertScale";
import { LuRefreshCw } from "react-icons/lu";
import { router } from "@inertiajs/react";
import CheckBox from "../../Components/CheckBox";
import {
    FiEye,
    FiFileText,
    FiUsers,
    FiCalendar,
    FiArrowLeft,
    FiCheckCircle,
} from "react-icons/fi";
import moment from "moment";
import { Button } from "@/Components/ui/button";
import { TbZoomQuestion } from "react-icons/tb";

function PreviewContent({ form }) {
    const formContext = React.useContext(FormContext);
    const formMode = formContext.getFormMode();

    // Use the fresh data from the backend instead of localStorage
    let formState = form;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <FiEye className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    Survey Preview
                                </h1>
                                <p className="text-gray-600 text-sm">
                                    Preview how your survey will appear to
                                    participants
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                onClick={() =>
                                    router.reload({ preserveState: true })
                                }
                            >
                                <LuRefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => window.close()}
                            >
                                <FiArrowLeft className="w-4 h-4 mr-2" />
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Survey Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                    <div className="text-center mb-6">
                        <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiFileText className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {formState.title}
                        </h2>
                        {formState.description && (
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                {formState.description}
                            </p>
                        )}
                    </div>

                    {/* Survey Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-6 border-t border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                                <FiCheckCircle className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Status
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    Draft
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-purple-100 p-2 rounded-lg">
                                <FiUsers className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Questions
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {formState.questions.length}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <FiCalendar className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Timeline
                                </p>
                                <p className="text-lg font-semibold text-gray-900">
                                    {formState.begin_date && formState.end_date
                                        ? `${moment(
                                              formState.begin_date
                                          ).format("MMM DD")} - ${moment(
                                              formState.end_date
                                          ).format("MMM DD, YYYY")}`
                                        : "Not set"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Survey Content */}
                <div className="space-y-6">
                    {formState.sections.length > 0 ? (
                        formState.sections.map((section) => (
                            <div
                                key={section.section_uid}
                                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                            >
                                {/* Section Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                                    <h3 className="text-xl font-semibold text-white">
                                        {section.name}
                                    </h3>
                                </div>

                                {/* Section Questions */}
                                <div className="p-6">
                                    <div className="space-y-8">
                                        {section.questions.map(
                                            (question, index) => (
                                                <div
                                                    key={question.question_uid}
                                                    className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                                                >
                                                    <div className="mb-4">
                                                        <div className="flex items-start gap-3">
                                                            <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                                                                Q{index + 1}
                                                            </span>
                                                            <div className="flex-1">
                                                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                                                    {
                                                                        question.question
                                                                    }
                                                                </h4>
                                                                {question.description && (
                                                                    <p className="text-gray-600 text-sm">
                                                                        {
                                                                            question.description
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="ml-12">
                                                        {question.answer
                                                            .type ===
                                                            "multiple_choice" && (
                                                            <MultipleChoice
                                                                questionId={
                                                                    question.question_uid
                                                                }
                                                                formMode={
                                                                    formMode
                                                                }
                                                                structure={
                                                                    question
                                                                        .answer
                                                                        .structure
                                                                }
                                                            />
                                                        )}
                                                        {question.answer
                                                            .type ===
                                                            "check_box" && (
                                                            <CheckBox
                                                                questionId={
                                                                    question.question_uid
                                                                }
                                                                formMode={
                                                                    formMode
                                                                }
                                                                structure={
                                                                    question
                                                                        .answer
                                                                        .structure
                                                                }
                                                            />
                                                        )}
                                                        {question.answer
                                                            .type ===
                                                            "written" && (
                                                            <Written
                                                                choice={
                                                                    question
                                                                        .answer
                                                                        .type
                                                                }
                                                                questionId={
                                                                    question.question_uid
                                                                }
                                                                formMode={
                                                                    formMode
                                                                }
                                                                structure={
                                                                    question
                                                                        .answer
                                                                        .structure
                                                                }
                                                            />
                                                        )}
                                                        {question.answer
                                                            .type ===
                                                            "yes_no" && (
                                                            <YesNo
                                                                choice={
                                                                    question
                                                                        .answer
                                                                        .type
                                                                }
                                                                questionId={
                                                                    question.question_uid
                                                                }
                                                                formMode={
                                                                    formMode
                                                                }
                                                                structure={
                                                                    question
                                                                        .answer
                                                                        .structure
                                                                }
                                                            />
                                                        )}
                                                        {question.answer
                                                            .type ===
                                                            "likert_scale" &&
                                                            // Check if it's a simple or table Likert scale
                                                            (question.answer
                                                                .structure &&
                                                            question.answer
                                                                .structure
                                                                .statements ? (
                                                                <TableLikertScale
                                                                    choice={
                                                                        question
                                                                            .answer
                                                                            .type
                                                                    }
                                                                    questionId={
                                                                        question.question_uid
                                                                    }
                                                                    formMode={
                                                                        formMode
                                                                    }
                                                                />
                                                            ) : (
                                                                <SimpleLikertScale
                                                                    questionId={
                                                                        question.question_uid
                                                                    }
                                                                    choice={
                                                                        question
                                                                            .answer
                                                                            .type
                                                                    }
                                                                    formMode={
                                                                        formMode
                                                                    }
                                                                />
                                                            ))}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="space-y-6">
                            {formState.questions.map((question, index) => (
                                <div
                                    key={question.question_uid}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                                >
                                    <div className="mb-4">
                                        <div className="flex items-start gap-3">
                                            <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                                                Q{index + 1}
                                            </span>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {question.question}
                                                </h4>
                                                {question.description && (
                                                    <p className="text-gray-600 text-sm">
                                                        {question.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="ml-12">
                                        {question.answer.type ===
                                        "likert_scale" ? (
                                            // Check if it's a simple or table Likert scale
                                            question.answer.structure &&
                                            question.answer.structure
                                                .statements ? (
                                                <TableLikertScale
                                                    choice={
                                                        question.answer.type
                                                    }
                                                    questionId={
                                                        question.question_uid
                                                    }
                                                    formMode={formMode}
                                                />
                                            ) : (
                                                <SimpleLikertScale
                                                    questionId={
                                                        question.question_uid
                                                    }
                                                    choice={
                                                        question.answer.type
                                                    }
                                                    formMode={formMode}
                                                />
                                            )
                                        ) : (
                                            <Question
                                                questionChoice={
                                                    question.answer.type
                                                }
                                                question={question}
                                                formMode={formMode}
                                                questionId={
                                                    question.question_uid
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Preview Footer */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8">
                    <div className="text-center">
                        <p className="text-gray-600 text-sm mb-4">
                            This is a preview of how your survey will appear to
                            participants
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Button
                                onClick={() => {
                                    router.get(
                                        "/survey/attend",
                                        { form_uid: formState.form_uid },
                                        { preserveState: true }
                                    );
                                }}
                            >
                                <TbZoomQuestion className="w-4 h-4 mr-2" />
                                Test Survey
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => window.close()}
                            >
                                Close Preview
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Preview = ({ form }) => {
    return (
        <FormProvider initialMode="preview" initialForm={form}>
            <PreviewContent form={form} />
        </FormProvider>
    );
};

export default Preview;

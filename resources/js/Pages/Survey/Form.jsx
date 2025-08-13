import React, { useEffect } from "react";
import Layout from "../Layout";
import ActionBar from "@/Components/ActionBar";
import { Button } from "@/Components/ui/button";
import Question from "@/Components/Question";
import { FormContext, FormProvider } from "@/Utilities/FormProvider";
import { TbZoomQuestion } from "react-icons/tb";
import Sections from "@/Components/Sections";
import { ToastContainer, toast } from "react-toastify";
import { MdEditNote } from "react-icons/md";
import DatePicker from "../../Components/DatePicker";
import moment from "moment";
import {
    FiPlus,
    FiCalendar,
    FiFileText,
    FiSettings,
    FiCheckCircle,
    FiAlertCircle,
} from "react-icons/fi";

//TODO
/**
 *
 * 1.  add side card to add extra information that will indicate from time and end time for the survey
 * 2. the form will not be published if start and end time are not set
 *
 *  On form creation, user should be directed first to add section if sections are to be added first
 */

function FormContent() {
    const formContext = React.useContext(FormContext);
    const startDate = formContext._beginDate();
    const endDate = formContext._endDate();

    useEffect(() => {
        console.log("Form component initialized in create mode");
        console.log("Initial form title:", formContext._formTitle());
    }, []);

    // Debug logging for form title changes
    useEffect(() => {
        console.log("Form title changed:", formContext._formTitle());
    }, [formContext._formTitle()]);

    // console.log(formContext.getFormUID());

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <ToastContainer position="top-center" />

            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Create New Survey
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Design and configure your survey
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="p-1 px-2 flex items-center gap-2"
                                onClick={() => window.history.back()}
                            >
                                ← Back
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-3">
                    <ActionBar toast={toast} />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Form Header */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <FiFileText className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                Survey Information
                                            </h2>
                                            <p className="text-gray-600 text-sm">
                                                Basic details about your survey
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Survey Title *
                                            </label>
                                            <input
                                                type="text"
                                                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                                    formContext._formTitle() &&
                                                    formContext
                                                        ._formTitle()
                                                        .trim()
                                                        ? "border-green-300 focus:ring-green-500 focus:border-green-500"
                                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                                }`}
                                                value={formContext._formTitle()}
                                                placeholder="Enter your survey title..."
                                                onChange={(e) =>
                                                    formContext._setFormTitle(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {formContext._formTitle() &&
                                                formContext
                                                    ._formTitle()
                                                    .trim() && (
                                                    <div className="flex items-center gap-2 mt-2 text-sm text-green-600">
                                                        <FiCheckCircle className="w-4 h-4" />
                                                        Title is set
                                                    </div>
                                                )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                rows={3}
                                                placeholder="Describe your survey purpose..."
                                                value={formContext._formDescription()}
                                                onChange={(e) =>
                                                    formContext._setFormDescription(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Questions Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-100 p-2 rounded-lg">
                                        <TbZoomQuestion className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Survey Questions
                                        </h2>
                                        <p className="text-gray-600 text-sm">
                                            Add and organize your questions
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={formContext.addFormQuestion}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                                >
                                    <FiPlus className="w-4 h-4" />
                                    Add Question
                                </Button>
                            </div>

                            {formContext.getFormQuestions().length > 0 ? (
                                <div className="space-y-4">
                                    {formContext.getFormQuestions().map((q) => (
                                        <Question
                                            questionId={q.question_uid}
                                            key={q.question_uid}
                                            question={q}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <TbZoomQuestion className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        No questions yet
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Start building your survey by adding
                                        questions
                                    </p>
                                    <Button
                                        onClick={formContext.addFormQuestion}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
                                    >
                                        <FiPlus className="w-5 h-5" />
                                        Add Your First Question
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Timeline Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-orange-100 p-2 rounded-lg">
                                    <FiCalendar className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Timeline
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Set survey duration
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <DatePicker
                                        placeholder="Start"
                                        name="start_date"
                                        id="start_date"
                                        value={startDate}
                                        onChange={(val) => {
                                            formContext._setBeginDate(val);
                                            const minEnd =
                                                val && moment(val).isValid()
                                                    ? moment(val).format(
                                                          "YYYY-MM-DD"
                                                      )
                                                    : "";
                                            if (
                                                endDate &&
                                                moment(endDate).isValid() &&
                                                moment(endDate).isBefore(
                                                    moment(val)
                                                )
                                            ) {
                                                formContext._setEndDate(val);
                                            }
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <DatePicker
                                        placeholder="End"
                                        name="end_date"
                                        id="end_date"
                                        value={endDate}
                                        onChange={formContext._setEndDate}
                                    />
                                </div>

                                <div className="p-3 rounded-lg bg-gray-50">
                                    {!startDate || !endDate ? (
                                        <div className="flex items-center gap-2 text-orange-600 text-sm">
                                            <FiAlertCircle className="w-4 h-4" />
                                            Set timeline to save survey
                                        </div>
                                    ) : startDate &&
                                      endDate &&
                                      moment(endDate).isSameOrBefore(
                                          moment(startDate)
                                      ) ? (
                                        <div className="flex items-center gap-2 text-red-600 text-sm">
                                            <FiAlertCircle className="w-4 h-4" />
                                            End date must be after start date
                                        </div>
                                    ) : startDate &&
                                      moment(startDate).isBefore(
                                          moment().startOf("day")
                                      ) ? (
                                        <div className="flex items-center gap-2 text-red-600 text-sm">
                                            <FiAlertCircle className="w-4 h-4" />
                                            Start date cannot be in the past
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-green-600 text-sm">
                                            <FiCheckCircle className="w-4 h-4" />
                                            Timeline is valid
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sections Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <FiSettings className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Sections
                                    </h3>
                                    <p className="text-gray-600 text-sm">
                                        Organize questions
                                    </p>
                                </div>
                            </div>
                            <Sections />
                        </div>

                        {/* Form Status */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">
                                Form Status
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Title
                                    </span>
                                    <span
                                        className={`text-sm ${
                                            formContext._formTitle() &&
                                            formContext._formTitle().trim()
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {formContext._formTitle() &&
                                        formContext._formTitle().trim()
                                            ? "✓"
                                            : "✗"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Timeline
                                    </span>
                                    <span
                                        className={`text-sm ${
                                            startDate &&
                                            endDate &&
                                            moment(endDate).isAfter(
                                                moment(startDate)
                                            )
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {startDate &&
                                        endDate &&
                                        moment(endDate).isAfter(
                                            moment(startDate)
                                        )
                                            ? "✓"
                                            : "✗"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">
                                        Questions
                                    </span>
                                    <span
                                        className={`text-sm ${
                                            formContext.getFormQuestions()
                                                .length > 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {formContext.getFormQuestions().length >
                                        0
                                            ? "✓"
                                            : "✗"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Form() {
    return (
        <FormProvider initialMode="create">
            <FormContent />
        </FormProvider>
    );
}

export default Form;

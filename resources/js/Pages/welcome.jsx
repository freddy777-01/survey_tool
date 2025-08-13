import React, { useEffect } from "react";
import Layout from "./Layout";
import ActionBar from "@/Components/ActionBar";
import Question from "@/Components/Question";
import { FormContext, FormProvider } from "@/Utilities/FormProvider";
import { TbZoomQuestion } from "react-icons/tb";
import Sections from "../Components/Sections";
import { ToastContainer, toast } from "react-toastify";
import { MdEditNote } from "react-icons/md";
import { FcSurvey } from "react-icons/fc";
import { router } from "@inertiajs/react";
import { useMemo, useState } from "react";
import { Button } from "@/Components/ui/button";
import { publishSurvey, unpublishSurvey } from "@/utilities/api";
import {
    FiPlus,
    FiEye,
    FiEdit3,
    FiUsers,
    FiCalendar,
    FiTrendingUp,
    FiTrendingDown,
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiList,
    FiGrid,
    FiBarChart2,
} from "react-icons/fi";

function getComputedState(form) {
    const today = new Date();
    const begin = form.begin_date ? new Date(form.begin_date) : null;
    const end = form.end_date ? new Date(form.end_date) : null;
    if (begin && end) {
        if (today >= begin && today <= end) return "active";
        if (today < begin) return "upcoming";
        if (today > end) return "expired";
    }
    return form.state || form.status || "unknown";
}

function getStatusColor(status) {
    switch (status) {
        case "active":
            return "bg-green-100 text-green-800 border-green-200";
        case "upcoming":
            return "bg-blue-100 text-blue-800 border-blue-200";
        case "expired":
            return "bg-red-100 text-red-800 border-red-200";
        default:
            return "bg-gray-100 text-gray-800 border-gray-200";
    }
}

function getStatusIcon(status) {
    switch (status) {
        case "active":
            return <FiCheckCircle className="w-4 h-4" />;
        case "upcoming":
            return <FiClock className="w-4 h-4" />;
        case "expired":
            return <FiXCircle className="w-4 h-4" />;
        default:
            return <FiList className="w-4 h-4" />;
    }
}

function welcome({ forms }) {
    const [filter, setFilter] = useState("all");
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const filteredForms = useMemo(() => {
        if (filter === "all") return forms;
        return forms.filter((f) => getComputedState(f) === filter);
    }, [forms, filter]);

    // Calculate statistics
    const stats = useMemo(() => {
        const total = forms.length;
        const active = forms.filter(
            (f) => getComputedState(f) === "active"
        ).length;
        const published = forms.filter((f) => f.published).length;

        return { total, active, published };
    }, [forms]);

    const handleAttendClick = (form) => {
        const state = getComputedState(form);

        if (state === "active" && form.published) {
            // Check if user has already responded to this survey (using localStorage)
            const attendedSurveys = JSON.parse(
                localStorage.getItem("attendedSurveys") || "[]"
            );
            if (attendedSurveys.includes(form.form_uid)) {
                setModalMessage(
                    "You have already participated in this survey. You cannot attend it again."
                );
                setShowModal(true);
                return;
            }

            // Survey is active and published, proceed to attend
            router.get(
                "/survey/attend",
                { form_uid: form.form_uid },
                { preserveState: true }
            );
        } else {
            // Show modal with appropriate message
            let message = "";
            if (!form.published) {
                message =
                    "This survey is not published yet. It will be available for participation once published.";
            } else if (state === "upcoming") {
                message =
                    "This survey is not active yet. It will be available for participation when it starts.";
            } else if (state === "expired") {
                message =
                    "This survey has expired and is no longer available for participation.";
            } else {
                message =
                    "This survey is not currently available for participation.";
            }

            setModalMessage(message);
            setShowModal(true);
        }
    };

    return (
        <Layout>
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            Survey Dashboard
                        </h1>
                        <p className="text-blue-100">
                            Manage and monitor your surveys
                        </p>
                    </div>
                    <Button
                        onClick={() => router.get("/survey/create")}
                        className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-semibold flex items-center gap-2"
                    >
                        <FiPlus className="w-5 h-5" />
                        Create Survey
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">
                                Total Surveys
                            </p>
                            <p className="text-3xl font-bold text-gray-900">
                                {stats.total}
                            </p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <FcSurvey className="w-8 h-8" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">
                                Active Surveys
                            </p>
                            <p className="text-3xl font-bold text-green-600">
                                {stats.active}
                            </p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <FiTrendingUp className="w-8 h-8 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">
                                Published
                            </p>
                            <p className="text-3xl font-bold text-purple-600">
                                {stats.published}
                            </p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <FiCheckCircle className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Your Surveys
                        </h2>
                        <div className="flex items-center gap-2">
                            <label className="text-sm font-medium text-gray-700">
                                Filter:
                            </label>
                            <select
                                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All Surveys</option>
                                <option value="active">Active</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant={
                                viewMode === "grid" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setViewMode("grid")}
                            className="flex items-center gap-2"
                        >
                            <FiGrid className="w-4 h-4" />
                            Grid
                        </Button>
                        <Button
                            variant={
                                viewMode === "list" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className="flex items-center gap-2"
                        >
                            <FiList className="w-4 h-4" />
                            List
                        </Button>
                    </div>
                </div>
            </div>

            {/* Surveys Grid/List */}
            {filteredForms.length > 0 ? (
                <div
                    className={
                        viewMode === "grid"
                            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                            : "space-y-4"
                    }
                >
                    {filteredForms.map((form, index) => (
                        <div
                            key={form.form_uid}
                            className={`bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden ${
                                viewMode === "list"
                                    ? "flex items-center p-6"
                                    : "p-6"
                            }`}
                        >
                            {viewMode === "grid" ? (
                                // Grid View
                                <>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                                {form.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-2">
                                                {form.description ||
                                                    "No description provided"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Status
                                            </span>
                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                    getComputedState(form)
                                                )}`}
                                            >
                                                {getStatusIcon(
                                                    getComputedState(form)
                                                )}
                                                {getComputedState(form)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Published
                                            </span>
                                            <span
                                                className={`text-sm font-medium ${
                                                    form.published
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {form.published ? "Yes" : "No"}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">
                                                Participants
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {form.participants ?? 0}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => {
                                                router.get(
                                                    "/survey/board",
                                                    { form_uid: form.form_uid },
                                                    { preserveState: true }
                                                );
                                            }}
                                        >
                                            <FiBarChart2 className="w-4 h-4" />
                                            Statistics
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => {
                                                const url = `/preview?form_uid=${form.form_uid}`;
                                                window.open(url, "_blank");
                                            }}
                                        >
                                            <FiEye className="w-4 h-4" />
                                            Preview
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => {
                                                handleAttendClick(form);
                                            }}
                                        >
                                            <FiUsers className="w-4 h-4" />
                                            Attend
                                        </Button>

                                        {form.published ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                                                onClick={async () => {
                                                    if (
                                                        confirm(
                                                            "Unpublish this survey? It will no longer be available for participation."
                                                        )
                                                    ) {
                                                        try {
                                                            const response =
                                                                await unpublishSurvey(
                                                                    {
                                                                        form_uid:
                                                                            form.form_uid,
                                                                    }
                                                                );

                                                            const data =
                                                                await response.json();
                                                            if (response.ok) {
                                                                toast.success(
                                                                    data.message
                                                                );
                                                                window.location.reload();
                                                            } else {
                                                                toast.error(
                                                                    "Failed to unpublish survey"
                                                                );
                                                            }
                                                        } catch (error) {
                                                            toast.error(
                                                                "Failed to unpublish survey"
                                                            );
                                                            console.error(
                                                                error
                                                            );
                                                        }
                                                    }
                                                }}
                                            >
                                                <FiXCircle className="w-4 h-4" />
                                                Unpublish
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
                                                onClick={async () => {
                                                    try {
                                                        const response =
                                                            await publishSurvey(
                                                                {
                                                                    form_uid:
                                                                        form.form_uid,
                                                                    begin_date:
                                                                        form.begin_date,
                                                                    end_date:
                                                                        form.end_date,
                                                                }
                                                            );

                                                        const data =
                                                            await response.json();
                                                        if (response.ok) {
                                                            toast.success(
                                                                data.message
                                                            );
                                                            window.location.reload();
                                                        } else {
                                                            toast.error(
                                                                data.error ||
                                                                    "Failed to publish survey"
                                                            );
                                                        }
                                                    } catch (error) {
                                                        toast.error(
                                                            "Failed to publish survey"
                                                        );
                                                        console.error(error);
                                                    }
                                                }}
                                            >
                                                <FiEdit3 className="w-4 h-4" />
                                                Publish
                                            </Button>
                                        )}
                                    </div>
                                </>
                            ) : (
                                // List View
                                <>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {form.name}
                                            </h3>
                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                    getComputedState(form)
                                                )}`}
                                            >
                                                {getStatusIcon(
                                                    getComputedState(form)
                                                )}
                                                {getComputedState(form)}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-2">
                                            {form.description ||
                                                "No description provided"}
                                        </p>
                                        <div className="flex items-center gap-6 text-sm text-gray-600">
                                            <span>
                                                Published:{" "}
                                                <span
                                                    className={`font-medium ${
                                                        form.published
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }`}
                                                >
                                                    {form.published
                                                        ? "Yes"
                                                        : "No"}
                                                </span>
                                            </span>
                                            <span>
                                                Participants:{" "}
                                                <span className="font-medium text-gray-900">
                                                    {form.participants ?? 0}
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => {
                                                router.get(
                                                    "/survey/board",
                                                    { form_uid: form.form_uid },
                                                    { preserveState: true }
                                                );
                                            }}
                                        >
                                            <FiBarChart2 className="w-4 h-4" />
                                            Statistics
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => {
                                                const url = `/preview?form_uid=${form.form_uid}`;
                                                window.open(url, "_blank");
                                            }}
                                        >
                                            <FiEye className="w-4 h-4" />
                                            Preview
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex items-center gap-1"
                                            onClick={() => {
                                                handleAttendClick(form);
                                            }}
                                        >
                                            <FiUsers className="w-4 h-4" />
                                            Attend
                                        </Button>

                                        {form.published ? (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                                                onClick={async () => {
                                                    if (
                                                        confirm(
                                                            "Unpublish this survey? It will no longer be available for participation."
                                                        )
                                                    ) {
                                                        try {
                                                            const response =
                                                                await unpublishSurvey(
                                                                    {
                                                                        form_uid:
                                                                            form.form_uid,
                                                                    }
                                                                );

                                                            const data =
                                                                await response.json();
                                                            if (response.ok) {
                                                                toast.success(
                                                                    data.message
                                                                );
                                                                window.location.reload();
                                                            } else {
                                                                toast.error(
                                                                    "Failed to unpublish survey"
                                                                );
                                                            }
                                                        } catch (error) {
                                                            toast.error(
                                                                "Failed to unpublish survey"
                                                            );
                                                            console.error(
                                                                error
                                                            );
                                                        }
                                                    }
                                                }}
                                            >
                                                <FiXCircle className="w-4 h-4" />
                                                Unpublish
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="default"
                                                size="sm"
                                                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
                                                onClick={async () => {
                                                    try {
                                                        const response =
                                                            await publishSurvey(
                                                                {
                                                                    form_uid:
                                                                        form.form_uid,
                                                                    begin_date:
                                                                        form.begin_date,
                                                                    end_date:
                                                                        form.end_date,
                                                                }
                                                            );

                                                        const data =
                                                            await response.json();
                                                        if (response.ok) {
                                                            toast.success(
                                                                data.message
                                                            );
                                                            window.location.reload();
                                                        } else {
                                                            toast.error(
                                                                data.error ||
                                                                    "Failed to publish survey"
                                                            );
                                                        }
                                                    } catch (error) {
                                                        toast.error(
                                                            "Failed to publish survey"
                                                        );
                                                        console.error(error);
                                                    }
                                                }}
                                            >
                                                <FiEdit3 className="w-4 h-4" />
                                                Publish
                                            </Button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
                    <FcSurvey className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No surveys found
                    </h3>
                    <p className="text-gray-600 mb-6">
                        {filter === "all"
                            ? "You haven't created any surveys yet. Get started by creating your first survey!"
                            : `No ${filter} surveys found. Try changing the filter or create a new survey.`}
                    </p>
                    <Button
                        onClick={() => router.get("/survey/create")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto"
                    >
                        <FiPlus className="w-5 h-5" />
                        Create Your First Survey
                    </Button>
                </div>
            )}

            {/* Modal for inactive survey notification */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-orange-100 p-2 rounded-lg">
                                <FiXCircle className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Survey Not Available
                            </h3>
                        </div>
                        <p className="text-gray-600 mb-6">{modalMessage}</p>
                        <div className="flex justify-end">
                            <Button
                                variant="default"
                                onClick={() => setShowModal(false)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}

export default welcome;

import React, { useEffect, useCallback } from "react";
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

function welcome({
    forms: initialForms,
    search: searchQuery = "",
    status: statusQuery = "all",
}) {
    const [forms, setForms] = useState(initialForms);
    const [filter, setFilter] = useState(statusQuery);
    const [searchTerm, setSearchTerm] = useState(searchQuery);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // Debounced search function
    const debouncedSearch = useCallback(
        (() => {
            let timeoutId;
            return (search, status) => {
                clearTimeout(timeoutId);
                setIsSearching(true);
                timeoutId = setTimeout(() => {
                    const params = new URLSearchParams({
                        search: search.trim(),
                        status: status,
                    });

                    fetch(`/search-surveys?${params}`)
                        .then((response) => response.json())
                        .then((data) => {
                            // Update the forms state with the search results
                            setForms(data.forms || []);
                            setIsSearching(false);
                        })
                        .catch((error) => {
                            console.error("Search error:", error);
                            setIsSearching(false);
                            // Keep current forms on error
                        });
                }, 200); // 200ms delay for faster response
            };
        })(),
        []
    );

    // Handle search input change
    const handleSearchChange = (value) => {
        setSearchTerm(value);
        debouncedSearch(value, filter);
    };

    // Handle filter change
    const handleFilterChange = (value) => {
        setFilter(value);
        debouncedSearch(searchTerm, value);
    };

    // Use forms directly since they come from backend search
    const filteredForms = forms;

    // Handle initial search if query parameters exist
    useEffect(() => {
        if (searchQuery || statusQuery !== "all") {
            debouncedSearch(searchQuery, statusQuery);
        }
    }, []); // Only run once on component mount

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
            {/* Header Section - Green Circle */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Surveys
                </h1>
                <p className="text-gray-600 text-lg">
                    manage and monitor your surveys
                </p>
            </div>

            {/* Main Content with Sidebar */}
            <div className="flex gap-6">
                {/* Left Sidebar - Red Circle */}
                <div className="w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                        <Button
                            onClick={() => router.get("/survey/create")}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 justify-center"
                        >
                            <FiPlus className="w-5 h-5" />
                            Create Survey
                        </Button>
                        {/* Space for future buttons */}
                        <div className="mt-4 space-y-2">
                            {/* Future buttons can be added here */}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1">
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

                    {/* Search and Filters - Yellow Circle */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search survey title or description..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        handleSearchChange(e.target.value)
                                    }
                                    className={`w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                        isSearching ? "pr-10" : ""
                                    }`}
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-medium text-gray-700">
                                    Status:
                                </label>
                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filter}
                                    onChange={(e) =>
                                        handleFilterChange(e.target.value)
                                    }
                                >
                                    <option value="all">All Surveys</option>
                                    <option value="active">Active</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="expired">Expired</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Surveys Table */}
                    {filteredForms.length > 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                                Survey
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                                Timeline
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredForms.map((form) => (
                                            <tr
                                                key={form.form_uid}
                                                className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                                                onClick={() => {
                                                    router.get(
                                                        "/survey/board",
                                                        {
                                                            form_uid:
                                                                form.form_uid,
                                                        },
                                                        { preserveState: true }
                                                    );
                                                }}
                                            >
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                                            {form.name}
                                                        </h3>
                                                        <p className="text-xs text-gray-600 line-clamp-2">
                                                            {form.description ||
                                                                "No description provided"}
                                                        </p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                            getComputedState(
                                                                form
                                                            )
                                                        )}`}
                                                    >
                                                        {getStatusIcon(
                                                            getComputedState(
                                                                form
                                                            )
                                                        )}
                                                        {getComputedState(form)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-600">
                                                        {form.begin_date &&
                                                        form.end_date ? (
                                                            <div>
                                                                <div className="font-medium">
                                                                    {new Date(
                                                                        form.begin_date
                                                                    ).toLocaleDateString()}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    to{" "}
                                                                    {new Date(
                                                                        form.end_date
                                                                    ).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                No timeline set
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white border-green-600"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (
                                                                !form.published
                                                            ) {
                                                                publishSurvey({
                                                                    form_uid:
                                                                        form.form_uid,
                                                                    begin_date:
                                                                        form.begin_date,
                                                                    end_date:
                                                                        form.end_date,
                                                                })
                                                                    .then(
                                                                        (
                                                                            response
                                                                        ) =>
                                                                            response.json()
                                                                    )
                                                                    .then(
                                                                        (
                                                                            data
                                                                        ) => {
                                                                            if (
                                                                                data.message
                                                                            ) {
                                                                                toast.success(
                                                                                    data.message
                                                                                );
                                                                            }
                                                                            router.reload();
                                                                        }
                                                                    )
                                                                    .catch(
                                                                        (
                                                                            error
                                                                        ) => {
                                                                            toast.error(
                                                                                "Failed to publish survey"
                                                                            );
                                                                        }
                                                                    );
                                                            } else {
                                                                unpublishSurvey(
                                                                    form.form_uid
                                                                )
                                                                    .then(
                                                                        (
                                                                            response
                                                                        ) =>
                                                                            response.json()
                                                                    )
                                                                    .then(
                                                                        (
                                                                            data
                                                                        ) => {
                                                                            if (
                                                                                data.message
                                                                            ) {
                                                                                toast.success(
                                                                                    data.message
                                                                                );
                                                                            }
                                                                            router.reload();
                                                                        }
                                                                    )
                                                                    .catch(
                                                                        (
                                                                            error
                                                                        ) => {
                                                                            toast.error(
                                                                                "Failed to unpublish survey"
                                                                            );
                                                                        }
                                                                    );
                                                            }
                                                        }}
                                                    >
                                                        {form.published
                                                            ? "Unpublish"
                                                            : "Publish"}
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                                Survey
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                                Timeline
                                            </th>
                                            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td
                                                colSpan="4"
                                                className="px-6 py-12 text-center"
                                            >
                                                <FcSurvey className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    No surveys found
                                                </h3>
                                                <p className="text-gray-600 mb-6">
                                                    {filter === "all" &&
                                                    !searchTerm.trim()
                                                        ? "You haven't created any surveys yet. Get started by creating your first survey!"
                                                        : searchTerm.trim()
                                                        ? `No surveys found matching "${searchTerm}". Try adjusting your search or filters.`
                                                        : `No ${filter} surveys found. Try changing the filter or create a new survey.`}
                                                </p>
                                                <Button
                                                    onClick={() =>
                                                        router.get(
                                                            "/survey/create"
                                                        )
                                                    }
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto"
                                                >
                                                    <FiPlus className="w-5 h-5" />
                                                    Create Your First Survey
                                                </Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

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

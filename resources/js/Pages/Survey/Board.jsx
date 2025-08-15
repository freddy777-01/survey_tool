import React from "react";
import Layout from "@/Pages/Layout";
import moment from "moment";
import { router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
} from "chart.js";
import {
    FiUsers,
    FiTrendingUp,
    FiCalendar,
    FiEye,
    FiEdit3,
    FiCheckCircle,
    FiXCircle,
    FiBarChart2,
    FiRefreshCw,
    FiDownload,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { makeApiRequest } from "@/utilities/api";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title
);

export default function Board({ form, participants: initialParticipants = 0 }) {
    const [participants, setParticipants] = useState(initialParticipants);
    const [total, setTotal] = useState(100);
    const [perQuestion, setPerQuestion] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const intervalRef = useRef(null);

    const fetchStats = async () => {
        try {
            const res = await fetch(
                `/api/surveys/stats?form_uid=${form.form_uid}`
            );
            if (res.ok) {
                const data = await res.json();
                setParticipants(data.participants ?? 0);
                setTotal(data.total ?? 100);
                setPerQuestion(data.perQuestion ?? []);
            }
        } catch (error) {
            // Error handling for stats fetching
        }
    };

    useEffect(() => {
        fetchStats();
        intervalRef.current = setInterval(fetchStats, 5000);
        return () => clearInterval(intervalRef.current);
    }, [form.form_uid]);

    const handlePublish = async () => {
        setIsLoading(true);
        try {
            const response = await makeApiRequest("/api/surveys/publish", {
                form_uid: form.form_uid,
                begin_date: form.begin_date,
                end_date: form.end_date,
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                window.location.reload();
            } else {
                toast.error(data.error || "Failed to publish survey");
            }
        } catch (error) {
            toast.error("Failed to publish survey");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnpublish = async () => {
        if (
            !confirm(
                "Unpublish this survey? It will no longer be available for participation."
            )
        ) {
            return;
        }

        setIsLoading(true);
        try {
            const response = await makeApiRequest("/api/surveys/unpublish", {
                form_uid: form.form_uid,
            });

            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                window.location.reload();
            } else {
                toast.error("Failed to unpublish survey");
            }
        } catch (error) {
            toast.error("Failed to unpublish survey");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800 border-green-200";
            case "inactive":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "active":
                return <FiCheckCircle className="w-4 h-4" />;
            case "inactive":
                return <FiXCircle className="w-4 h-4" />;
            default:
                return <FiBarChart2 className="w-4 h-4" />;
        }
    };

    const participationRate = total > 0 ? (participants / total) * 100 : 0;

    return (
        <Layout>
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold mb-2">
                                {form.name}
                            </h1>
                            <p className="text-blue-100">{form.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                                onClick={fetchStats}
                            >
                                <FiRefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">
                                    Total Participants
                                </p>
                                <p className="text-3xl font-bold text-blue-600">
                                    {participants}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <FiUsers className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">
                                    Participation Rate
                                </p>
                                <p className="text-3xl font-bold text-green-600">
                                    {participationRate.toFixed(1)}%
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
                                    Remaining
                                </p>
                                <p className="text-3xl font-bold text-orange-600">
                                    {Math.max(total - participants, 0)}
                                </p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <FiCalendar className="w-8 h-8 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">
                                    Status
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span
                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                            form.status
                                        )}`}
                                    >
                                        {getStatusIcon(form.status)}
                                        {form.status}
                                    </span>
                                </div>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <FiBarChart2 className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline and Actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Survey Timeline
                            </h2>
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-600">
                                        Start:
                                    </span>
                                    <span className="text-sm text-gray-900">
                                        {form.begin_date
                                            ? moment(form.begin_date).format(
                                                  "MMM DD, YYYY"
                                              )
                                            : "Not set"}
                                    </span>
                                </div>
                                <div className="w-px h-6 bg-gray-300"></div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-600">
                                        End:
                                    </span>
                                    <span className="text-sm text-gray-900">
                                        {form.end_date
                                            ? moment(form.end_date).format(
                                                  "MMM DD, YYYY"
                                              )
                                            : "Not set"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                className="p-1 px-2 flex items-center gap-2"
                                onClick={() => {
                                    router.get(
                                        "/survey/edit",
                                        { form_uid: form.form_uid },
                                        { preserveState: true }
                                    );
                                }}
                            >
                                <FiEdit3 className="w-4 h-4" />
                                Edit
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                className="p-1 px-2 flex items-center gap-2"
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
                                className="p-1 px-2 flex items-center gap-2"
                                onClick={() => {
                                    router.get(
                                        "/survey/attend",
                                        { form_uid: form.form_uid },
                                        { preserveState: true }
                                    );
                                }}
                            >
                                <FiUsers className="w-4 h-4" />
                                Attend
                            </Button>

                            {form.published ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="p-1 px-2 flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={handleUnpublish}
                                    disabled={isLoading}
                                >
                                    <FiXCircle className="w-4 h-4" />
                                    {isLoading
                                        ? "Unpublishing..."
                                        : "Unpublish"}
                                </Button>
                            ) : (
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="p-1 px-2 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
                                    onClick={handlePublish}
                                    disabled={isLoading}
                                >
                                    <FiCheckCircle className="w-4 h-4" />
                                    {isLoading ? "Publishing..." : "Publish"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Question Statistics
                        </h2>
                        <Button
                            variant="outline"
                            size="sm"
                            className="p-1 px-2 flex items-center gap-2"
                        >
                            <FiDownload className="w-4 h-4" />
                            Export Data
                        </Button>
                    </div>

                    {perQuestion.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {perQuestion.map((q, index) => {
                                // Handle different question types
                                let labels = [];
                                let values = [];
                                let totalResponses = 0;

                                if (q.type === "likert_scale") {
                                    // Handle Likert scale questions
                                    if (q.likert_stats.simple) {
                                        // Simple Likert scale
                                        labels = Object.keys(
                                            q.likert_stats.simple
                                        );
                                        values = Object.values(
                                            q.likert_stats.simple
                                        );
                                        totalResponses = values.reduce(
                                            (sum, val) => sum + val,
                                            0
                                        );
                                    } else {
                                        // Table Likert scale - show per-statement breakdown
                                        // We'll handle this separately in the render logic
                                        labels = [];
                                        values = [];
                                        totalResponses = 0;
                                    }
                                } else {
                                    // Handle regular questions
                                    labels = Object.keys(q.counts || {});
                                    values = Object.values(q.counts || {});
                                    totalResponses = values.reduce(
                                        (sum, val) => sum + val,
                                        0
                                    );
                                }

                                // Doughnut chart data
                                const doughnutData = {
                                    labels,
                                    datasets: [
                                        {
                                            data: values,
                                            backgroundColor: [
                                                "#3B82F6",
                                                "#10B981",
                                                "#F59E0B",
                                                "#EF4444",
                                                "#8B5CF6",
                                                "#EC4899",
                                                "#06B6D4",
                                                "#84CC16",
                                                "#F97316",
                                                "#6366F1",
                                            ],
                                            borderWidth: 2,
                                            borderColor: "#ffffff",
                                        },
                                    ],
                                };

                                // Bar chart data for better visualization
                                const barData = {
                                    labels,
                                    datasets: [
                                        {
                                            label: "Responses",
                                            data: values,
                                            backgroundColor: [
                                                "#3B82F6",
                                                "#10B981",
                                                "#F59E0B",
                                                "#EF4444",
                                                "#8B5CF6",
                                                "#EC4899",
                                                "#06B6D4",
                                                "#84CC16",
                                                "#F97316",
                                                "#6366F1",
                                            ],
                                            borderColor: [
                                                "#2563EB",
                                                "#059669",
                                                "#D97706",
                                                "#DC2626",
                                                "#7C3AED",
                                                "#DB2777",
                                                "#0891B2",
                                                "#65A30D",
                                                "#EA580C",
                                                "#4F46E5",
                                            ],
                                            borderWidth: 1,
                                        },
                                    ],
                                };

                                const chartOptions = {
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: "bottom",
                                            labels: {
                                                padding: 20,
                                                usePointStyle: true,
                                            },
                                        },
                                        tooltip: {
                                            callbacks: {
                                                label: function (context) {
                                                    const percentage =
                                                        totalResponses > 0
                                                            ? (
                                                                  (context.parsed /
                                                                      totalResponses) *
                                                                  100
                                                              ).toFixed(1)
                                                            : 0;
                                                    return `${context.label}: ${context.parsed} (${percentage}%)`;
                                                },
                                            },
                                        },
                                    },
                                };

                                return (
                                    <div
                                        key={q.question_id}
                                        className="bg-gray-50 rounded-lg p-6"
                                    >
                                        <div className="mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                {q.question}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Total responses:{" "}
                                                {totalResponses}
                                            </p>
                                        </div>

                                        {q.type === "likert_scale" &&
                                        !q.likert_stats.simple ? (
                                            // Table Likert scale - show detailed breakdown
                                            <div className="space-y-6">
                                                {/* Summary Statistics */}
                                                <div className="bg-white p-4 rounded-lg border">
                                                    <h4 className="font-medium text-gray-900 mb-3">
                                                        Response Summary
                                                    </h4>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <span className="text-gray-600">
                                                                Total
                                                                Statements:
                                                            </span>
                                                            <span className="ml-2 font-medium">
                                                                {
                                                                    Object.keys(
                                                                        q.likert_stats
                                                                    ).length
                                                                }
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-gray-600">
                                                                Total Responses:
                                                            </span>
                                                            <span className="ml-2 font-medium">
                                                                {q.total}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Per-Statement Breakdown */}
                                                <div className="space-y-4">
                                                    <h4 className="font-medium text-gray-900">
                                                        Per-Statement Responses
                                                    </h4>
                                                    {Object.keys(
                                                        q.likert_stats
                                                    ).map(
                                                        (
                                                            statementId,
                                                            index
                                                        ) => {
                                                            const statementResponses =
                                                                q.likert_stats[
                                                                    statementId
                                                                ];
                                                            const statementLabels =
                                                                Object.keys(
                                                                    statementResponses
                                                                );
                                                            const statementValues =
                                                                Object.values(
                                                                    statementResponses
                                                                );
                                                            const statementTotal =
                                                                statementValues.reduce(
                                                                    (
                                                                        sum,
                                                                        val
                                                                    ) =>
                                                                        sum +
                                                                        val,
                                                                    0
                                                                );

                                                            const statementData =
                                                                {
                                                                    labels: statementLabels,
                                                                    datasets: [
                                                                        {
                                                                            data: statementValues,
                                                                            backgroundColor:
                                                                                [
                                                                                    "#3B82F6",
                                                                                    "#10B981",
                                                                                    "#F59E0B",
                                                                                    "#EF4444",
                                                                                    "#8B5CF6",
                                                                                ],
                                                                            borderWidth: 2,
                                                                            borderColor:
                                                                                "#ffffff",
                                                                        },
                                                                    ],
                                                                };

                                                            return (
                                                                <div
                                                                    key={
                                                                        statementId
                                                                    }
                                                                    className="bg-white p-4 rounded-lg border"
                                                                >
                                                                    <h5 className="font-medium text-gray-800 mb-2">
                                                                        Statement{" "}
                                                                        {index +
                                                                            1}
                                                                    </h5>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div className="h-48">
                                                                            <Doughnut
                                                                                data={
                                                                                    statementData
                                                                                }
                                                                                options={{
                                                                                    responsive: true,
                                                                                    maintainAspectRatio: false,
                                                                                    plugins:
                                                                                        {
                                                                                            legend: {
                                                                                                position:
                                                                                                    "bottom",
                                                                                                labels: {
                                                                                                    padding: 10,
                                                                                                    usePointStyle: true,
                                                                                                },
                                                                                            },
                                                                                            tooltip:
                                                                                                {
                                                                                                    callbacks:
                                                                                                        {
                                                                                                            label: function (
                                                                                                                context
                                                                                                            ) {
                                                                                                                const percentage =
                                                                                                                    statementTotal >
                                                                                                                    0
                                                                                                                        ? (
                                                                                                                              (context.parsed /
                                                                                                                                  statementTotal) *
                                                                                                                              100
                                                                                                                          ).toFixed(
                                                                                                                              1
                                                                                                                          )
                                                                                                                        : 0;
                                                                                                                return `${context.label}: ${context.parsed} (${percentage}%)`;
                                                                                                            },
                                                                                                        },
                                                                                                },
                                                                                        },
                                                                                }}
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-2">
                                                                            {statementLabels.map(
                                                                                (
                                                                                    label,
                                                                                    i
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            label
                                                                                        }
                                                                                        className="flex justify-between items-center text-sm"
                                                                                    >
                                                                                        <span className="text-gray-600">
                                                                                            {
                                                                                                label
                                                                                            }

                                                                                            :
                                                                                        </span>
                                                                                        <span className="font-medium">
                                                                                            {
                                                                                                statementValues[
                                                                                                    i
                                                                                                ]
                                                                                            }{" "}
                                                                                            responses
                                                                                        </span>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                            <div className="border-t pt-2 mt-2">
                                                                                <div className="flex justify-between items-center text-sm font-medium">
                                                                                    <span>
                                                                                        Total:
                                                                                    </span>
                                                                                    <span>
                                                                                        {
                                                                                            statementTotal
                                                                                        }{" "}
                                                                                        responses
                                                                                    </span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>
                                        ) : values.length > 0 ? (
                                            <div className="space-y-6">
                                                {/* Doughnut Chart */}
                                                <div className="h-64">
                                                    <Doughnut
                                                        data={doughnutData}
                                                        options={chartOptions}
                                                    />
                                                </div>

                                                {/* Bar Chart for better comparison */}
                                                <div className="h-48">
                                                    <Bar
                                                        data={barData}
                                                        options={{
                                                            ...chartOptions,
                                                            scales: {
                                                                y: {
                                                                    beginAtZero: true,
                                                                    ticks: {
                                                                        stepSize: 1,
                                                                    },
                                                                },
                                                            },
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="h-64 flex items-center justify-center">
                                                <div className="text-center">
                                                    <FiBarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                                    <p className="text-gray-500">
                                                        No responses yet
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FiBarChart2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No questions found
                            </h3>
                            <p className="text-gray-600">
                                Add questions to your survey to see statistics
                                here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

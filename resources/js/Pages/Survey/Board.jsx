import React from "react";
import Layout from "@/Pages/Layout";
import moment from "moment";
import { router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { useEffect, useRef, useState } from "react";
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
import SurveyResults from "@/Components/SurveyResults";

export default function Board({ form, participants: initialParticipants = 0 }) {
    const [participants, setParticipants] = useState(initialParticipants);
    const [total, setTotal] = useState(100);
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
                                className="p-1 px-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
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
                                    Survey Status
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                            form.status
                                        )}`}
                                    >
                                        {getStatusIcon(form.status)}
                                        <span className="ml-1 capitalize">
                                            {form.status}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg">
                                <FiBarChart2 className="w-8 h-8 text-gray-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">
                                    Timeline
                                </p>
                                <p className="text-sm text-gray-900 mt-1">
                                    {form.begin_date
                                        ? moment(form.begin_date).format(
                                              "MMM DD"
                                          )
                                        : "No start"}{" "}
                                    -{" "}
                                    {form.end_date
                                        ? moment(form.end_date).format("MMM DD")
                                        : "No end"}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <FiCalendar className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() =>
                                router.get("/survey/edit", {
                                    form_uid: form.form_uid,
                                })
                            }
                            className="p-1 px-2 bg-blue-600 hover:bg-blue-700"
                        >
                            <FiEdit3 className="w-4 h-4 mr-2" />
                            Edit Survey
                        </Button>
                        {/* {<Button
                            onClick={() =>
                                router.get("/survey/preview", {
                                    form_uid: form.form_uid,
                                })
                            }
                            variant="outline"
                            className="p-1 px-2"
                        >
                            <FiEye className="w-4 h-4 mr-2" />
                            Preview
                        </Button>} */}
                    </div>
                    <div className="flex items-center gap-3">
                        {form.published ? (
                            <Button
                                onClick={handleUnpublish}
                                disabled={isLoading}
                                variant="outline"
                                className="p-1 px-2 border-red-200 text-red-600 hover:bg-red-50"
                            >
                                {isLoading ? (
                                    <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <FiXCircle className="w-4 h-4 mr-2" />
                                )}
                                Unpublish
                            </Button>
                        ) : (
                            <Button
                                onClick={handlePublish}
                                disabled={isLoading}
                                className="p-1 px-2 bg-green-600 hover:bg-green-700"
                            >
                                {isLoading ? (
                                    <FiRefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <FiCheckCircle className="w-4 h-4 mr-2" />
                                )}
                                Publish Survey
                            </Button>
                        )}
                    </div>
                </div>

                {/* Survey Results Component */}
                <SurveyResults form={form} />
            </div>
        </Layout>
    );
}

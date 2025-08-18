import React, { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { FiDownload, FiRefreshCw, FiBarChart2, FiUsers } from "react-icons/fi";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

export default function SurveyResults({ form }) {
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [totalResponses, setTotalResponses] = useState(0);

    const fetchResults = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `/api/surveys/results?form_uid=${form.form_uid}`
            );
            if (response.ok) {
                const data = await response.json();
                console.log("Raw API response:", data); // Debug log
                // Ensure all data is properly formatted
                const formattedResults = (data.results || []).map(
                    (question) => ({
                        ...question,
                        question: String(question.question || ""),
                        type: String(question.type || "unknown"),
                        totalResponses: parseInt(question.totalResponses || 0),
                        responses: (question.responses || []).map(
                            (response) => ({
                                option: String(response.option || ""),
                                count: parseInt(response.count || 0),
                                percentage: parseFloat(
                                    response.percentage || 0
                                ),
                            })
                        ),
                        statements: (question.statements || []).map(
                            (statement) => {
                                console.log("Raw statement:", statement); // Debug log
                                return {
                                    text: String(statement.text || ""),
                                    totalResponses: parseInt(
                                        statement.totalResponses || 0
                                    ),
                                    responses: (statement.responses || []).map(
                                        (response) => ({
                                            option: String(
                                                response.option || ""
                                            ),
                                            count: parseInt(
                                                response.count || 0
                                            ),
                                            percentage: parseFloat(
                                                response.percentage || 0
                                            ),
                                        })
                                    ),
                                };
                            }
                        ),
                    })
                );
                setResults(formattedResults);
                setTotalResponses(parseInt(data.totalResponses || 0));
            } else {
                toast.error("Failed to fetch survey results");
            }
        } catch (error) {
            console.error("Error fetching survey results:", error);
            toast.error("Error fetching survey results");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [form.form_uid]);

    const exportToExcel = () => {
        try {
            // Prepare data for export
            const exportData = results.map((question) => {
                // Start with basic question data (excluding type)
                const baseData = {
                    Question: question.question || "",
                    "Total Responses": question.totalResponses || 0,
                };

                // Add response options and counts for non-Likert questions
                if (
                    question.responses &&
                    Array.isArray(question.responses) &&
                    question.responses.length > 0
                ) {
                    question.responses.forEach((response, index) => {
                        baseData[`Option ${index + 1}`] = response.option || "";
                        baseData[`Count ${index + 1}`] = response.count || 0;
                        baseData[`Percentage ${index + 1}`] = `${
                            response.percentage || 0
                        }%`;
                    });
                }

                // Add Likert scale specific data
                if (
                    question.type === "likert_scale" &&
                    question.statements &&
                    question.statements.length > 0
                ) {
                    question.statements.forEach((statement, index) => {
                        baseData[`Statement ${index + 1}`] =
                            statement.text || "";
                        baseData[`Statement ${index + 1} Total Responses`] =
                            statement.totalResponses || 0;

                        if (
                            statement.responses &&
                            statement.responses.length > 0
                        ) {
                            statement.responses.forEach(
                                (response, respIndex) => {
                                    baseData[
                                        `Statement ${index + 1} - ${
                                            response.option || ""
                                        }`
                                    ] = response.count || 0;
                                }
                            );
                        }
                    });
                }

                return baseData;
            });

            console.log("Export data:", exportData); // Debug log

            // Create workbook and worksheet
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Survey Results");

            // Auto-size columns
            const colWidths = [];
            exportData.forEach((row) => {
                Object.keys(row).forEach((key, index) => {
                    const length = Math.max(
                        key.length,
                        String(row[key]).length
                    );
                    colWidths[index] = Math.max(colWidths[index] || 0, length);
                });
            });

            ws["!cols"] = colWidths.map((width) => ({
                width: Math.min(width + 2, 50),
            }));

            // Save file
            XLSX.writeFile(
                wb,
                `${form.name}_results_${
                    new Date().toISOString().split("T")[0]
                }.xlsx`
            );
            toast.success("Results exported successfully!");
        } catch (error) {
            toast.error("Failed to export results");
        }
    };

    const renderQuestionCard = (question, index) => {
        console.log("Rendering question:", question); // Debug log
        const renderBasicResponses = () => (
            <div className="space-y-3">
                <div className="text-sm text-gray-600">
                    Total responses: {question.totalResponses}
                </div>
                {question.responses && question.responses.length > 0 && (
                    <div className="space-y-2">
                        {question.responses.map((response, respIndex) => (
                            <div
                                key={respIndex}
                                className="flex items-center justify-between"
                            >
                                <span className="text-sm font-medium">
                                    {typeof response.option === "string"
                                        ? response.option
                                        : String(response.option)}
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{
                                                width: `${response.percentage}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-600 w-8 text-right">
                                        {response.count}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );

        const renderLikertScale = () => (
            <div className="space-y-4">
                <div className="text-sm text-gray-600">
                    Total responses: {question.totalResponses}
                </div>
                {question.statements &&
                    question.statements.map((statement, stmtIndex) => (
                        <div
                            key={stmtIndex}
                            className="bg-white border border-gray-200 rounded-lg p-3"
                        >
                            <div className="text-sm font-medium mb-2">
                                {typeof statement.text === "string"
                                    ? statement.text
                                    : String(statement.text)}
                            </div>
                            <div className="text-xs text-gray-500">
                                Total: {statement.totalResponses} responses
                            </div>
                            {statement.responses && (
                                <div className="mt-2 space-y-1">
                                    {statement.responses.map(
                                        (response, respIndex) => (
                                            <div
                                                key={respIndex}
                                                className="flex items-center justify-between"
                                            >
                                                <span className="text-xs">
                                                    {typeof response.option ===
                                                    "string"
                                                        ? response.option
                                                        : String(
                                                              response.option
                                                          )}
                                                </span>
                                                <span className="text-xs text-gray-600">
                                                    {response.count} response
                                                    {response.count !== 1
                                                        ? "s"
                                                        : ""}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        );

        return (
            <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {question.question}
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                            {question.type === "multiple_choice"
                                ? "Multiple Choice"
                                : question.type === "checkbox"
                                ? "Checkbox"
                                : question.type === "likert_scale"
                                ? "Likert Scale"
                                : question.type === "written"
                                ? "Written"
                                : question.type === "yes_no"
                                ? "Yes/No"
                                : question.type === "date"
                                ? "Date"
                                : question.type}
                        </span>
                    </div>
                </div>

                {question.type === "likert_scale"
                    ? renderLikertScale()
                    : renderBasicResponses()}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Question Statistics
                        </h1>
                        <p className="text-gray-600">Survey: {form.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={fetchResults}
                            disabled={isLoading}
                            className="p-1 px-2"
                        >
                            <FiRefreshCw
                                className={`w-4 h-4 mr-2 ${
                                    isLoading ? "animate-spin" : ""
                                }`}
                            />
                            Refresh
                        </Button>
                        <Button
                            size="sm"
                            onClick={exportToExcel}
                            disabled={results.length === 0}
                            className="p-1 px-2"
                        >
                            <FiDownload className="w-4 h-4 mr-2" />
                            Export Data
                        </Button>
                    </div>
                </div>
            </div>

            {/* Summary Report */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Summary Report
                </h2>

                {/* Sex Distribution Table */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Sex
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                                        Desc
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-center font-medium text-gray-700">
                                        TOTAL EMPLOYEE
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-center font-medium text-gray-700">
                                        TOTAL SURVEY
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-center font-medium text-gray-700">
                                        MALE
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-center font-medium text-gray-700">
                                        FEMALE
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-center font-medium text-gray-700">
                                        PERCENTAGE %
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2 font-medium">
                                        Sex
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        673
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        621
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        319
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        302
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        92.27%
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Age Distribution Table */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Age
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                                        Age
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-center font-medium text-gray-700">
                                        TOTAL
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-center font-medium text-gray-700">
                                        PERCENTAGE %
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">
                                        22 to 35
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        51
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        7.58%
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">
                                        36 to 45
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        330
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        49.03%
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">
                                        46 to 60
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        241
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        35.81%
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Directorate Distribution Table */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">
                        Directorate
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 px-4 py-2 text-left font-medium text-gray-700">
                                        Directorate
                                    </th>
                                    <th className="border border-gray-300 px-4 py-2 text-center font-medium text-gray-700">
                                        TOTAL
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">
                                        1: Director General Office
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        2
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">
                                        2: Directorate Of Actuarial And Risk
                                        Management
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        93
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">
                                        3: Directorate Of Finance
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        64
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">
                                        4: Directorate Of Human Resource and
                                        Administration
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        67
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">
                                        5: Directorate Of Information and
                                        Communication Technology
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        20
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-gray-300 px-4 py-2">
                                        6: Directorate Of Internal Audit
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2 text-center">
                                        10
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {results.map((question, index) =>
                        renderQuestionCard(question, index)
                    )}
                </div>
            ) : (
                <div className="text-center py-12">
                    <FiBarChart2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No Results Available
                    </h3>
                    <p className="text-gray-600">
                        No responses have been recorded for this survey yet.
                    </p>
                </div>
            )}

            {/* Summary */}
            {results.length > 0 && (
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                            {results.length} questions total
                        </span>
                        <span className="text-sm text-gray-600">
                            {totalResponses} total responses
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}

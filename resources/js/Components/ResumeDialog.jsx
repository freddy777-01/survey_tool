import React from "react";
import { Button } from "@/Components/ui/button";

const ResumeDialog = ({ isOpen, onResume, onStartNew, lastUpdated }) => {
    if (!isOpen) return null;

    const formatLastUpdated = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-xl">
                <div className="mb-6">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
                        <svg
                            className="h-6 w-6 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            ></path>
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Resume Survey?
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                        We found a partially completed response from your
                        previous session.
                    </p>
                    {lastUpdated && (
                        <p className="text-xs text-gray-400 mb-4">
                            Last saved: {formatLastUpdated(lastUpdated)}
                        </p>
                    )}
                    <p className="text-sm text-gray-600">
                        Would you like to continue where you left off?
                    </p>
                </div>
                <div className="flex gap-3 justify-center">
                    <Button
                        onClick={onResume}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                    >
                        Resume Survey
                    </Button>
                    <Button
                        onClick={onStartNew}
                        variant="outline"
                        className="px-6 py-2"
                    >
                        Start New
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ResumeDialog;

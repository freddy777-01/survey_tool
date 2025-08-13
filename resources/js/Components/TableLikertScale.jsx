import React from "react";
import { RxCross2 } from "react-icons/rx";
import { CgAddR } from "react-icons/cg";
import { FormContext } from "@/utilities/FormProvider";
import moment from "moment";

// Utility function to generate unique IDs
let idCounter = 0;
const generateUniqueId = () => {
    idCounter += 1;
    return moment().valueOf() + idCounter;
};

export default function TableLikertScale({ questionId, choice, formMode }) {
    const formContext = React.useContext(FormContext);

    const [statements, setStatements] = React.useState([
        { id: generateUniqueId(), text: "Statement 1" },
    ]);

    const [likertOptions, setLikertOptions] = React.useState([
        {
            id: generateUniqueId(),
            name: "strongly_agree",
            value: "Strongly Agree",
        },
        { id: generateUniqueId(), name: "agree", value: "Agree" },
        { id: generateUniqueId(), name: "neutral", value: "Neutral" },
        { id: generateUniqueId(), name: "disagree", value: "Disagree" },
        {
            id: generateUniqueId(),
            name: "strongly_disagree",
            value: "Strongly Disagree",
        },
    ]);

    React.useEffect(() => {
        formContext.changeAnswerStructure(questionId, choice, {
            statements: statements,
            options: likertOptions,
        });
    }, [choice, statements, likertOptions, questionId]);

    const addStatement = () => {
        const newStatement = {
            id: generateUniqueId(),
            text: `Statement ${statements.length + 1}`,
        };
        setStatements([...statements, newStatement]);
    };

    const removeStatement = (statementId) => {
        setStatements(statements.filter((stmt) => stmt.id !== statementId));
    };

    const updateStatement = (statementId, newText) => {
        setStatements(
            statements.map((stmt) =>
                stmt.id === statementId ? { ...stmt, text: newText } : stmt
            )
        );
    };

    const addLikertOption = () => {
        const newOption = {
            id: generateUniqueId(),
            name: `option_${likertOptions.length + 1}`,
            value: `Option ${likertOptions.length + 1}`,
        };
        setLikertOptions([...likertOptions, newOption]);
    };

    const removeLikertOption = (optionId) => {
        if (likertOptions.length > 2) {
            // Keep at least 2 options
            setLikertOptions(
                likertOptions.filter((opt) => opt.id !== optionId)
            );
        }
    };

    const updateLikertOption = (optionId, newValue) => {
        setLikertOptions(
            likertOptions.map((opt) =>
                opt.id === optionId ? { ...opt, value: newValue } : opt
            )
        );
    };

    if (formMode === "create" || formMode === "edit") {
        return (
            <div className="space-y-4">
                {/* Likert Options Configuration */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                        Response Options
                    </h4>
                    <div className="space-y-2">
                        {likertOptions.map((option, index) => (
                            <div
                                key={option.id}
                                className="flex items-center gap-2"
                            >
                                <input
                                    type="text"
                                    value={option.value}
                                    onChange={(e) =>
                                        updateLikertOption(
                                            option.id,
                                            e.target.value
                                        )
                                    }
                                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="Option text"
                                />
                                {likertOptions.length > 2 && (
                                    <button
                                        onClick={() =>
                                            removeLikertOption(option.id)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <RxCross2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={addLikertOption}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                        >
                            <CgAddR className="w-4 h-4" />
                            Add Option
                        </button>
                    </div>
                </div>

                {/* Statements Configuration */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                        Statements
                    </h4>
                    <div className="space-y-2">
                        {statements.map((statement, index) => (
                            <div
                                key={statement.id}
                                className="flex items-center gap-2"
                            >
                                <span className="text-sm text-gray-500 w-8">
                                    {index + 1}.
                                </span>
                                <input
                                    type="text"
                                    value={statement.text}
                                    onChange={(e) =>
                                        updateStatement(
                                            statement.id,
                                            e.target.value
                                        )
                                    }
                                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                                    placeholder="Enter statement"
                                />
                                {statements.length > 1 && (
                                    <button
                                        onClick={() =>
                                            removeStatement(statement.id)
                                        }
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <RxCross2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            onClick={addStatement}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
                        >
                            <CgAddR className="w-4 h-4" />
                            Add Statement
                        </button>
                    </div>
                </div>

                {/* Preview */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Preview</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-300">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                                        Statement
                                    </th>
                                    {likertOptions.map((option) => (
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
                                {statements.map((statement, index) => (
                                    <tr key={statement.id}>
                                        <td className="border border-gray-300 px-3 py-2 text-sm">
                                            {index + 1}. {statement.text}
                                        </td>
                                        {likertOptions.map((option) => (
                                            <td
                                                key={option.id}
                                                className="border border-gray-300 px-3 py-2 text-center"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`statement_${statement.id}`}
                                                    value={option.value}
                                                    className="cursor-pointer"
                                                    disabled
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }

    // Display mode (for survey taking)
    return (
        <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium text-gray-700">
                            Statement
                        </th>
                        {likertOptions.map((option) => (
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
                    {statements.map((statement, index) => (
                        <tr key={statement.id}>
                            <td className="border border-gray-300 px-3 py-2 text-sm">
                                {index + 1}. {statement.text}
                            </td>
                            {likertOptions.map((option) => (
                                <td
                                    key={option.id}
                                    className="border border-gray-300 px-3 py-2 text-center"
                                >
                                    <input
                                        type="radio"
                                        name={`statement_${statement.id}`}
                                        value={option.value}
                                        className="cursor-pointer h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

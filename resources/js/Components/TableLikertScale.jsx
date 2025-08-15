import React from "react";
import { RxCross2 } from "react-icons/rx";
import { CgAddR } from "react-icons/cg";
import { FormContext } from "@/utilities/FormProvider";
import moment from "moment";

// Utility function to generate unique IDs
let idCounter = 0;
const generateUniqueId = (l) => {
    idCounter += 1;
    return moment().valueOf() + idCounter + l;
};

export default function TableLikertScale({ questionId, choice, formMode }) {
    const formContext = React.useContext(FormContext);
    const [isInitialized, setIsInitialized] = React.useState(false);

    const [statements, setStatements] = React.useState([]);
    const [likertOptions, setLikertOptions] = React.useState([]);

    // Load existing structure when component mounts or structure changes
    React.useEffect(() => {
        const isInitialized = formContext.getIsInitialized();
        const questions = formContext.getFormQuestions();

        const question = questions.find((q) => q.question_uid === questionId);

        if (!question || !question.answer || !question.answer.structure) {
            return;
        }

        // Initialize variables outside the if block
        let foundStatements = null;
        let foundOptions = null;

        // Load statements - try different possible structures
        if (
            question.answer.structure.statements &&
            Array.isArray(question.answer.structure.statements)
        ) {
            foundStatements = question.answer.structure.statements;
        } else if (
            question.answer.structure.s &&
            Array.isArray(question.answer.structure.s)
        ) {
            // Handle optimized structure format
            foundStatements = question.answer.structure.s.map((item) => ({
                id: item.id || generateUniqueId(1),
                text: item.t || item.text || "Statement",
            }));
        } else if (Array.isArray(question.answer.structure)) {
            // Handle case where structure is a direct array
            foundStatements = question.answer.structure.map((item, index) => ({
                id: item.id || generateUniqueId(index + 1),
                text: item.text || item.t || `Statement ${index + 1}`,
            }));
        }

        if (foundStatements && foundStatements.length > 0) {
            setStatements(foundStatements);
        }

        // Load options - try different possible structures
        if (
            question.answer.structure.options &&
            Array.isArray(question.answer.structure.options)
        ) {
            foundOptions = question.answer.structure.options;
        } else if (
            question.answer.structure.o &&
            Array.isArray(question.answer.structure.o)
        ) {
            // Handle optimized structure format
            foundOptions = question.answer.structure.o.map((item) => ({
                id: item.id || generateUniqueId(1),
                name: item.name || "option",
                value: item.v || item.value || "Option",
            }));
        }

        if (foundOptions && foundOptions.length > 0) {
            setLikertOptions(foundOptions);
        }

        // Mark as initialized after loading data
        setIsInitialized(true);
    }, [questionId, formMode, formContext.getFormQuestions()?.length]);

    React.useEffect(() => {
        // Only update after initialization to prevent overwriting loaded data
        if (!isInitialized) {
            return;
        }

        // Ensure statements and likertOptions are arrays before passing to changeAnswerStructure
        const safeStatements = Array.isArray(statements) ? statements : [];
        const safeLikertOptions = Array.isArray(likertOptions)
            ? likertOptions
            : [];

        formContext.changeAnswerStructure(questionId, choice, {
            statements: safeStatements,
            options: safeLikertOptions,
        });
    }, [choice, statements, likertOptions, questionId, isInitialized]);

    const addStatement = () => {
        const currentStatements = Array.isArray(statements) ? statements : [];
        const newStatement = {
            id: generateUniqueId(1),
            text: `Statement ${currentStatements.length + 1}`,
        };
        const updatedStatements = [...currentStatements, newStatement];
        setStatements(updatedStatements);
    };

    const removeStatement = (statementId) => {
        if (Array.isArray(statements)) {
            setStatements(statements.filter((stmt) => stmt.id !== statementId));
        }
    };

    const updateStatement = (statementId, newText) => {
        if (Array.isArray(statements)) {
            setStatements(
                statements.map((stmt) =>
                    stmt.id === statementId ? { ...stmt, text: newText } : stmt
                )
            );
        }
    };

    const addLikertOption = () => {
        const currentOptions = Array.isArray(likertOptions)
            ? likertOptions
            : [];
        const newOption = {
            id: generateUniqueId(1),
            name: `option_${currentOptions.length + 1}`,
            value: `Option ${currentOptions.length + 1}`,
            checked: false,
        };
        setLikertOptions([...currentOptions, newOption]);
    };

    const removeLikertOption = (optionId) => {
        if (Array.isArray(likertOptions) && likertOptions.length > 2) {
            // Keep at least 2 options
            setLikertOptions(
                likertOptions.filter((opt) => opt.id !== optionId)
            );
        }
    };

    const updateLikertOption = (optionId, newValue) => {
        if (Array.isArray(likertOptions)) {
            setLikertOptions(
                likertOptions.map((opt) =>
                    opt.id === optionId ? { ...opt, value: newValue } : opt
                )
            );
        }
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
                        {Array.isArray(likertOptions) &&
                            likertOptions.map((option, index) => (
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
                        {Array.isArray(statements) &&
                            statements.map((statement, index) => (
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
                                            {statement.text}
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
                                {statement.text}
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

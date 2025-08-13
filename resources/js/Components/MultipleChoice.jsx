import React, { useEffect, useState } from "react";
import { FormContext } from "@/utilities/FormProvider";
import { CgAddR } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import { Button } from "@/Components/ui/button";
import moment from "moment";

export default function MultipleChoice({
    questionId,
    choice,
    formMode,
    structure = [],
}) {
    const formContext = React.useContext(FormContext);

    const [choices, setChoices] = React.useState(structure);

    useEffect(() => {
        const question = formContext
            .getFormQuestions()
            .find((q) => q.question_uid === questionId);

        if (question && question.answer && question.answer.structure) {
            setChoices(question.answer.structure);
        }
    }, [formContext.getFormQuestions(), questionId]);

    useEffect(() => {
        if (formMode === "create" || formMode === "edit") {
            formContext.changeAnswerStructure(questionId, choice, choices);
        }
    }, [choice]);

    let updateChoices = () => {};
    let addChoice = (choice) => {
        setChoices([...choices, choice]);
    };
    return (
        <div>
            <ul className="">
                {choices.map((choice, index) => (
                    <li
                        className="flex flex-row justify-between items-center p-2"
                        key={choice.id}
                    >
                        <div className="flex items-center gap-x-2">
                            <input
                                type="radio"
                                value={choice.value}
                                name={choice.name}
                                className="cursor-pointer h-5 w-5 border border-slate-300 transition-all checked:border-blue-300 focus:ring-1 rounded-md p-1.5"
                                disabled={
                                    formMode == "create" || formMode == "edit"
                                        ? true
                                        : false
                                }
                                id={questionId + choice.id}
                            />
                            {formMode == "create" || formMode == "edit" ? (
                                <input
                                    type="text"
                                    className="focus:outline-none mx-2 border-b-1"
                                    placeholder="label..."
                                    value={choice.value}
                                    onChange={(e) =>
                                        formContext.changeChoiceLabel(
                                            questionId,
                                            choice.id,
                                            e.target.value
                                        )
                                    }
                                />
                            ) : (
                                <label
                                    className="hover:cursor-pointer"
                                    htmlFor={questionId + choice.id}
                                >
                                    {choice.value}
                                </label>
                            )}
                        </div>
                        {(formMode == "create" || formMode == "edit") && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="ml-2 p-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() =>
                                    formContext.removeQuestionChoice(
                                        questionId,
                                        choice.id
                                    )
                                }
                            >
                                <RxCross2 className="w-4 h-4" />
                            </Button>
                        )}
                    </li>
                ))}
            </ul>
            {(formMode == "create" || formMode == "edit") && (
                <div id="choices" className="mt-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="p-1 px-2 flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                        onClick={() =>
                            formContext.addQuestionChoice(
                                questionId,
                                "multiple_choice"
                            )
                        }
                    >
                        <CgAddR className="w-4 h-4" />
                        <span>Add option</span>
                    </Button>
                </div>
            )}
        </div>
    );
}

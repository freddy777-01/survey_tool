import React, { useEffect, useState } from "react";
import { FormContext } from "@/utilities/FormProvider";
import { CgAddR } from "react-icons/cg";
import { RxCross2 } from "react-icons/rx";
import { Button } from "@/Components/ui/button";
import moment from "moment";

//FIXME => label editing does not work due to change of questionId

export default function CheckBox({
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
            /* console.log("Choices set to:", question.answer.structure);
            console.log(choices); */
        } else {
            console.warn("Question or structure not found yet");
        }
    }, [formContext.getFormQuestions(), questionId]);

    useEffect(() => {
        if (formMode === "create" || formMode === "edit") {
            formContext.changeAnswerStructure(questionId, choice, choices);
        }
    }, [choice]);

    return (
        <div>
            <ul className="">
                {choices.map((choice, index) => (
                    <li
                        className="flex flex-row justify-between items-center p-2 list-none"
                        key={choice.id}
                    >
                        <div className="flex items-center gap-x-2">
                            <input
                                type="checkbox"
                                id={questionId + choice.id}
                                value={choice.value}
                                name={"check_box"}
                                className="cursor-pointer h-5 w-5 border border-slate-300 transition-all checked:border-blue-300 focus:ring-1 rounded-md p-1.5"
                                disabled={
                                    formMode == "create" || formMode == "edit"
                                        ? true
                                        : false
                                }
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
                        className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                        onClick={() =>
                            formContext.addQuestionChoice(
                                questionId,
                                "check_box"
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

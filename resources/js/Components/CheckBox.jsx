import React, { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { CgAddR } from "react-icons/cg";
import moment from "moment";
import { FormContext } from "@/utilities/FormProvider";

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
            .find((q) => q.id === questionId);

        if (question && question.answer && question.answer.structure) {
            setChoices(question.answer.structure);
            /* console.log("Choices set to:", question.answer.structure);
            console.log(choices); */
        } else {
            console.warn("Question or structure not found yet");
        }
    }, [formContext.getFormQuestions(), questionId]);

    useEffect(() => {
        formContext.changeAnswerStructure(questionId, choice, choices);
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
                                id={choice.id}
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
                                    htmlFor={choice.id}
                                >
                                    {choice.value}
                                </label>
                            )}
                        </div>
                        {(formMode == "create" || formMode == "edit") && (
                            <button
                                className="ml-2 p-1 rounded-md text-black hover:bg-gray-200 transition-colors cursor-pointer"
                                onClick={() =>
                                    formContext.removeQuestionChoice(
                                        questionId,
                                        choice.id
                                    )
                                }
                            >
                                <RxCross2 />
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {(formMode == "create" || formMode == "edit") && (
                <div id="choices" className="mt-2">
                    <button
                        className="flex flex-row justify-between items-center p-1 bg-blue-300 rounded-md shadow-md hover:bg-blue-400 transition-colors cursor-pointer"
                        onClick={() =>
                            formContext.addQuestionChoice(
                                questionId,
                                "check_box"
                            )
                        }
                    >
                        <CgAddR className="mx-auto" title="" />
                        <span className="text-gray-700 font-semibold mx-2">
                            Add option
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
}

import React, { useContext, useEffect, useId } from "react";
import MultipleChoice from "./MultipleChoice";
import CheckBox from "./CheckBox";
import Written from "./Written";
import { ImBin2 } from "react-icons/im";
import { FormContext } from "@/utilities/FormProvider";
import YesNo from "./YesNo";
import LikertScale from "./LikertScale";
import { LuPencilLine } from "react-icons/lu";
import { Button } from "@/Components/ui/button";

export default function Question({
    questionId,
    question,
    questionChoice = "multiple_choice",
    formMode = "create",
    defaultSection = {},
}) {
    const formContext = useContext(FormContext);
    const [choice, setChoice] = React.useState(questionChoice);
    const [addDescription, setAddDescription] = React.useState(false);
    const [selectedSection, setSelectedSection] =
        React.useState(defaultSection);

    // console.log(defaultSection);

    useEffect(() => {
        // If defaultSection is provided (from edit page), use it
        if (defaultSection && defaultSection.section_uid) {
            setSelectedSection(defaultSection);
            return;
        }

        // Otherwise, find the section from formContext (for create mode)
        let _selectedSection = formContext.getSections().find((section) => {
            return section.questions_uid.includes(questionId);
        });
        setSelectedSection(_selectedSection);
        console.log(selectedSection);
    }, [formContext.getSections(), defaultSection, questionId]);

    return (
        <li className="w-[40rem] p-2 rounded-lg shadow-lg bg-gray-100 my-5 list-none">
            {(formMode == "create" || formMode == "edit") && (
                <div
                    className={`p-2 flex flex-row gap-x-1.5 ${
                        formContext.getSections().length > 0
                            ? "justify-between"
                            : "justify-end"
                    } mb-3`}
                >
                    {formContext.getSections().length > 0 && (
                        <div className="flex flex-row gap-x-1.5 items-center">
                            <select
                                className="ring-1 ring-blue-300 focus:ring-1 focus:ring-blue-500 rounded-md p-1.5"
                                onChange={(e) =>
                                    formContext.addQuestionToSection(
                                        questionId,
                                        e.target.value
                                    )
                                }
                                defaultValue={selectedSection?.section_uid}
                            >
                                <option value="">Assign Section</option>
                                {formContext.getSections().map((section) => (
                                    <option
                                        value={section.section_uid}
                                        key={section.section_uid}
                                    >
                                        {section.name === ""
                                            ? `Section : ${section.number}`
                                            : section.name}
                                    </option>
                                ))}
                            </select>

                            {selectedSection && (
                                <div className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md font-medium">
                                    {selectedSection.name === ""
                                        ? `Section ${selectedSection.number}`
                                        : selectedSection.name}
                                </div>
                            )}
                        </div>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                        title="delete question"
                        onClick={() =>
                            formContext.removeFormQuestion(questionId)
                        }
                    >
                        <ImBin2 className="w-4 h-4" />
                    </Button>
                </div>
            )}

            <div className="grid grid-cols-3 gap-x-10">
                <input
                    type="text"
                    placeholder="Question..."
                    className=" col-span-2 focus:outline-none focus:ring-blue-300 focus:ring-1 rounded-md p-1.5 "
                    value={question.question}
                    onChange={(e) =>
                        formContext.writeQuestion(questionId, e.target.value)
                    }
                    disabled={
                        formMode == "create" || formMode == "edit"
                            ? false
                            : true
                    }
                />
                {(formMode == "create" || formMode == "edit") && (
                    <select
                        className="ring-1 ring-blue-300 focus:ring-1 focus:ring-blue-500 rounded-md p-1.5"
                        onChange={(e) => setChoice(e.target.value)}
                        // value={formContext.choice}
                        defaultValue={questionChoice}
                    >
                        <option value="multiple_choice">Multiple Choice</option>
                        <option value="check_box">Check Box</option>
                        <option value="written">Written</option>
                        <option value="yes_no">Yes/No</option>
                        <option value="likert_scale">Likert Scale</option>
                    </select>
                )}
            </div>
            {/* description */}
            <div>
                <div
                    className={`${
                        addDescription ? "block" : "hidden"
                    } mt-3 transition-all`}
                >
                    <input
                        type="text"
                        className="focus:outline-none ring-1 ring-blue-300 focus:ring-1 focus:ring-blue-500 rounded-md p-1.5 w-[70%]"
                        // value={formTitle}
                        placeholder="description..."
                        // onChange={(e) => setFormTitle(e.target.value)}
                    />
                </div>
            </div>
            <div id="choices" className="mt-3 p-2">
                {choice === "multiple_choice" && (
                    <MultipleChoice
                        key={useId()}
                        questionId={questionId}
                        choice={choice}
                        formMode={formMode}
                        structure={question.answer.structure}
                    />
                )}
                {choice === "check_box" && (
                    <CheckBox
                        key={useId()}
                        questionId={questionId}
                        choice={choice}
                        formMode={formMode}
                        structure={question.answer.structure}
                    />
                )}
                {choice === "written" && (
                    <Written
                        key={useId()}
                        questionId={questionId}
                        choice={choice}
                        formMode={formMode}
                    />
                )}
                {choice === "yes_no" && (
                    <YesNo
                        key={useId()}
                        questionId={questionId}
                        choice={choice}
                        formMode={formMode}
                    />
                )}
                {choice === "likert_scale" && (
                    <LikertScale
                        key={useId()}
                        questionId={questionId}
                        choice={choice}
                        formMode={formMode}
                    />
                )}
            </div>
        </li>
    );
}

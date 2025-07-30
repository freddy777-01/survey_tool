import { CgAddR } from "react-icons/cg";
import { FormContext } from "@/utilities/FormProvider";
import React, { useContext } from "react";

export default function ActionBar() {
    const formContext = useContext(FormContext);
    return (
        <div className="flex flex-row justify-center items-center">
            <div className="flex flex-row justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md">
                <button
                    className="flex flex-row justify-center items-center bg-blue-300 p-2 rounded-lg cursor-pointer"
                    title="add question"
                    onClick={() =>
                        formContext.addFormQuestion({
                            id: formContext.formQuestions.length + 1,
                            answer: {
                                type: "multiple_choice",
                                choices: [{ value: "option1" }],
                            },
                        })
                    }
                >
                    <CgAddR className="mx-auto" title="" />
                    <span className="text-gray-700 font-semibold mx-2">
                        Add question
                    </span>
                </button>
            </div>
        </div>
    );
}

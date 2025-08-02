import { CgAddR } from "react-icons/cg";
import { FormContext } from "@/utilities/FormProvider";
import React, { useContext, useEffect } from "react";
import ShortUniqueId from "short-unique-id";
import { TiEqualsOutline } from "react-icons/ti";
// import { ToastContainer, toast } from "react-toastify";

//TODO => add a preview button here
/**
 * 1 > add preview button with eye icon
 *
 */
export default function ActionBar({ questionId, toast }) {
    const formContext = useContext(FormContext);
    const uid = new ShortUniqueId({ length: 10 });
    const notify = () => toast("Wow so easy!");

    /* useEffect(() => {
        console.log(formContext.getFormQuestions());
    }, [formContext.getFormQuestions()]); */

    return (
        <div className="flex flex-row justify-center items-center">
            <div className="flex flex-row gap-x-3 items-center p-4 bg-gray-100 rounded-lg shadow-md">
                <button
                    className="flex flex-row justify-center items-center bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-lg cursor-pointer"
                    title="add question"
                    onClick={formContext.addFormQuestion}
                >
                    <CgAddR className="mx-auto" title="" />
                    <span className=" font-semibold mx-2">Add question</span>
                </button>
                <button
                    className="flex flex-row justify-center items-center bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-lg cursor-pointer"
                    title="add question"
                    onClick={formContext.addSection}
                >
                    <TiEqualsOutline className="mx-auto" title="" />
                    <span className=" font-semibold mx-2">Add Section</span>
                </button>
            </div>
            <button
                className="bg-green-400 p-2 px-5 rounded-lg text-white font-semibold text-lg right-[6rem] absolute hover:bg-blue-400 cursor-pointer transition-colors"
                onClick={() => {
                    if (formContext.getFormQuestions().length === 0) {
                        toast.error("Please add at least one question ");
                        return;
                    }
                    if (formContext.checkEmptySections().length > 0) {
                        toast.warning(
                            "Please assign questions to available sections"
                        );
                    }
                }}
                // {...formContext.getFormQuestions().length ==0 && disable}
            >
                Save
            </button>
        </div>
    );
}

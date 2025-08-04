import { CgAddR } from "react-icons/cg";
import { FormContext } from "@/utilities/FormProvider";
import React, { useContext, useEffect } from "react";
import ShortUniqueId from "short-unique-id";
import { TiEqualsOutline } from "react-icons/ti";
import { IoMdCloudUpload } from "react-icons/io";
import { LuEye } from "react-icons/lu";
import { MdOutlinePublish } from "react-icons/md";
import { Link } from "@inertiajs/react";

// import { ToastContainer, toast } from "react-toastify";

//TODO => create a saving button here
/**
 *
 * THe saving button will appear if there are questions on the form, either, the button will be disabled or hidden
 */
export default function ActionBar({ questionId, toast }) {
    const formContext = useContext(FormContext);
    const uid = new ShortUniqueId({ length: 10 });
    const notify = () => toast("Wow so easy!");

    /* useEffect(() => {
        console.log(formContext.getFormQuestions());
    }, [formContext.getFormQuestions()]); */

    const submitForm = () => {
        // console.log(formContext.getSections());
        // console.log(formContext.checkEmptySections());

        if (formContext.getFormQuestions().length === 0) {
            toast.error("Please add at least one question ");
        } else if (formContext.checkEmptySections()) {
            toast.warning("Please assign questions to available sections");
        } else {
            if (formContext.compileForm()) {
                console.log(formContext._formState());
            }
        }
    };
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
            <div className="absolute right-[2rem] text-white font-semibold text-lg flex flex-row justify-end items-center gap-x-2">
                <a
                    href={"/preview"}
                    target="_blank"
                    className="flex flex-row gap-x-2 items-center p-2 px-2 rounded-lg bg-blue-400 hover:bg-blue-500 cursor-pointer transition-colors"
                >
                    <LuEye />
                    <span>Preview</span>
                </a>

                <button className="flex flex-row gap-x-2 items-center p-2 px-2 rounded-lg bg-blue-400 hover:bg-blue-500 cursor-pointer transition-colors">
                    <MdOutlinePublish />
                    <span>Publish</span>
                </button>

                <button
                    className="flex flex-row items-center gap-x-2 p-2 px-2 rounded-lg bg-blue-400 hover:bg-blue-500 cursor-pointer transition-colors"
                    onClick={() => submitForm()}
                >
                    <IoMdCloudUpload />
                    <span>Save</span>
                </button>
            </div>
        </div>
    );
}

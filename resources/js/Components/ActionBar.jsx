import { CgAddR } from "react-icons/cg";
import { FormContext } from "@/utilities/FormProvider";
import React, { useContext } from "react";
import ShortUniqueId from "short-unique-id";
import { TiEqualsOutline } from "react-icons/ti";

export default function ActionBar({ questionId }) {
    const formContext = useContext(FormContext);
    const uid = new ShortUniqueId({ length: 10 });

    return (
        <div className="flex flex-row justify-center items-center">
            <div className="flex flex-row gap-x-3 items-center p-4 bg-gray-100 rounded-lg shadow-md">
                <button
                    className="flex flex-row justify-center items-center bg-blue-300 p-2 rounded-lg cursor-pointer"
                    title="add question"
                    onClick={formContext.addFormQuestion}
                >
                    <CgAddR className="mx-auto" title="" />
                    <span className="text-gray-700 font-semibold mx-2">
                        Add question
                    </span>
                </button>
                <button
                    className="flex flex-row justify-center items-center bg-blue-300 p-2 rounded-lg cursor-pointer"
                    title="add question"
                    onClick={formContext.addFormQuestion}
                >
                    <TiEqualsOutline className="mx-auto" title="" />
                    <span className="text-gray-700 font-semibold mx-2">
                        Add Section
                    </span>
                </button>
            </div>
        </div>
    );
}

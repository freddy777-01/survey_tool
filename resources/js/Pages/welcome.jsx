import React, { useEffect } from "react";
import Layout from "./Layout";
import ActionBar from "@/Components/ActionBar";
import Question from "@/Components/Question";
import { FormContext, FormProvider } from "@/Utilities/FormProvider";
import { TbZoomQuestion } from "react-icons/tb";
import Sections from "../Components/Sections";
import { ToastContainer, toast } from "react-toastify";
import { MdEditNote } from "react-icons/md";
import { FcSurvey } from "react-icons/fc";
import { router } from "@inertiajs/react";

function welcome({ forms }) {
    console.log(forms);

    return (
        <Layout>
            <p>Dashboard</p>
            <a href="/survey/create">Create</a>
            <div className="grid grid-cols-5 gap-2">
                {forms.length > 0 ? (
                    forms.map((form, index) => (
                        <div
                            className="rounded-md p-2 flex flex-col justify-between w-auto h-auto hover:cursor-pointer hover:bg-blue-100 shadow-sm hover:shadow-md transition-all duration-300"
                            key={form.form_uid}
                        >
                            <div
                                className="hover:shadow-md hover:shadow-white/50 p-2 rounded-md my-3"
                                onClick={() => {
                                    router.get(
                                        "/survey/board",
                                        {
                                            form_uid: form.form_uid,
                                        },
                                        {
                                            preserveState: true,
                                        }
                                    );
                                }}
                            >
                                <div className="">
                                    {/* <FcSurvey /> */}
                                    <p className="text-xl font-semibold font-inter">
                                        {form.name}
                                    </p>
                                    <p className="italic text-md text-gray-600 mt-2">
                                        {form.description}
                                    </p>
                                </div>
                                <div className="my-3">
                                    <div className="flex flex-row gap-x-2 items-center">
                                        <span>Status</span>
                                        <span
                                            className={`p-1 px-3 rounded-md text-sm bg-gray-300 ${
                                                form.status == "inactive"
                                                    ? "text-red-500"
                                                    : "text-green-300"
                                            }`}
                                        >
                                            {form.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-row gap-x-2 items-center">
                                        <span>Participants:</span>
                                        <span>50 out of 100</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 justify-end text-white">
                                {/* <button className="flex flex-row gap-x-2 items-center p-1 px-3 text-sm rounded-md bg-blue-400 hover:bg-blue-500 cursor-pointer transition-colors">
                                    Edit
                                </button> */}
                                <button
                                    className="flex flex-row gap-x-2 items-center p-1 px-3 text-sm rounded-md bg-blue-400 hover:bg-blue-500 cursor-pointer transition-colors"
                                    onClick={() => {
                                        const url = `/preview?form_uid=${form.form_uid}`;
                                        window.open(url, "_blank");
                                    }}
                                >
                                    Preview
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>Surveys not available</div>
                )}
            </div>
        </Layout>
    );
}

export default welcome;

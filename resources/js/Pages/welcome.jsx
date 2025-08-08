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
                            className="rounded-md shadow-md p-1 "
                            key={form.form_uid}
                        >
                            <div className="text-blue-300 text-6xl text-center mx-auto">
                                <FcSurvey />
                            </div>
                            <div className="flex gap-2 text-white">
                                <button className="flex flex-row gap-x-2 items-center p-2 px-2 rounded-lg bg-blue-400 hover:bg-blue-500 cursor-pointer transition-colors">
                                    Edit
                                </button>
                                <button
                                    className="flex flex-row gap-x-2 items-center p-2 px-2 rounded-lg bg-blue-400 hover:bg-blue-500 cursor-pointer transition-colors"
                                    onClick={() => {
                                        router.get(
                                            "/preview",
                                            {
                                                form_uid: form.form_uid,
                                            },
                                            {
                                                preserveState: true,
                                            }
                                        );
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

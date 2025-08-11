import React from "react";
import Layout from "@/Pages/Layout";
import moment from "moment";
import { router } from "@inertiajs/react";

//TODO
/**
 * 1. based on the timeline if the status is active then it is published.
 *    incase timeline has ended and not published(inactive), can edit time line to be able to publish again
 *
 */
export default function Board({ form }) {
    console.log(form);

    return (
        <Layout>
            <div className="w-[60rem]">
                <div className="flex justify-between p-1 rounded-md">
                    <div className="">
                        <p className="text-xl font-semibold font-inter">
                            {form.name}
                        </p>
                        <p className="italic text-md text-gray-600 mt-2">
                            {form.description}
                        </p>
                    </div>
                    <div className="shadow-md p-2 rounded-md w-[20rem]">
                        {/* status card */}
                        <div className="flex flex-col gap-x-2">
                            <p className="">Time line</p>
                            <div className="p-1 flex gap-x-2">
                                <div className="flex flex-row gap-x-2 items-center">
                                    <span>Start</span>
                                    <span>
                                        {form.begin_date
                                            ? form.begin_date
                                            : moment().format("DD-MM-YYYY")}
                                    </span>
                                </div>
                                <div className="divide-dashed border"></div>
                                <div className="flex flex-row gap-x-2 items-center">
                                    <span>End</span>
                                    <span>
                                        {form.end_date
                                            ? form.end_date
                                            : moment().format("DD-MM-YYYY")}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-x-2 items-center my-2">
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
                        <div className="flex flex-row gap-x-2 items-center my-2">
                            <span>Participants:</span>
                            <span>50 out of 100</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 justify-end text-white my-3 p-1 rounded-md">
                    {/* action buttons */}
                    <button
                        className="flex flex-row gap-x-2 items-center p-1 px-3 text-sm rounded-md bg-blue-400 hover:bg-blue-500 cursor-pointer transition-colors"
                        onClick={() => {
                            router.get(
                                "/survey/edit",
                                {
                                    form_uid: form.form_uid,
                                },
                                {
                                    preserveState: true,
                                }
                            );
                        }}
                    >
                        Edit
                    </button>
                    <button
                        className="flex flex-row gap-x-2 items-center p-1 px-3 text-sm rounded-md bg-blue-400 hover:bg-blue-500 cursor-pointer transition-colors"
                        onClick={() => {
                            /* router.get(
                                "/preview",
                                {
                                    form_uid: form.form_uid,
                                },
                                {
                                    preserveState: true,
                                }
                            ); */
                            const url = `/preview?form_uid=${form.form_uid}`;
                            window.open(url, "_blank");
                        }}
                    >
                        Preview
                    </button>
                </div>

                <div className="my-3 rounded-md">
                    <p className="text-center">
                        display survey stats and graphs
                    </p>
                </div>
            </div>
        </Layout>
    );
}

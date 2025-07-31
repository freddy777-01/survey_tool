import React, { useContext, useEffect } from "react";
import MultipleChoice from "./MultipleChoice";
import CheckBox from "./CheckBox";
import Written from "./Written";
import { ImBin2 } from "react-icons/im";
import { FormContext } from "@/utilities/FormProvider";
import YesNo from "./YesNo";
import LikertScale from "./LikertScale";
import { LuPencilLine } from "react-icons/lu";

export default function Question({ questionId, content }) {
    const [choice, setChoice] = React.useState("multiple_choice");
    const formContext = useContext(FormContext);
    const [addDescription, setAddDescription] = React.useState(false);

    return (
        <li className="w-[40rem] p-2 rounded-lg shadow-lg bg-gray-100 my-5">
            <div className="p-2 flex flex-row gap-x-1.5 justify-end mb-3">
                {/* <button
                    className=" bg-blue-300 hover:bg-blue-500 transition-colors text-white font-semibold p-1 cursor-pointer rounded-md px-1 flex gap-x-1.5 items-center justify-center"
                    onClick={() => setAddDescription(!addDescription)}
                >
                    <LuPencilLine />
                </button> */}
                <button
                    className="bg-blue-300 hover:bg-blue-500 text-white p-1 rounded-md transition-colors cursor-pointer"
                    title="delete question"
                    onClick={() => formContext.removeFormQuestion(questionId)}
                >
                    <ImBin2 />
                </button>
            </div>
            <div className="grid grid-cols-3 gap-x-10">
                <input
                    type="text"
                    placeholder="Question..."
                    className=" col-span-2 focus:outline-none focus:ring-blue-300 focus:ring-1 rounded-md p-1.5 "
                    value={content.q}
                    onChange={(e) =>
                        formContext.writeQuestion(questionId, e.target.value)
                    }
                />
                <select
                    className="ring-1 ring-blue-300 focus:ring-1 focus:ring-blue-500 rounded-md p-1.5"
                    onChange={(e) => setChoice(e.target.value)}
                >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="check_box">Check Box</option>
                    <option value="written">Written</option>
                    <option value="yes_no">Yes/No</option>
                    <option value="likert_scale">Likert Scale</option>
                </select>
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
                    <MultipleChoice questionId={questionId} />
                )}
                {choice === "check_box" && <CheckBox questionId={questionId} />}
                {choice === "written" && <Written questionId={questionId} />}
                {choice === "yes_no" && <YesNo questionId={questionId} />}
                {choice === "likert_scale" && (
                    <LikertScale questionId={questionId} />
                )}
            </div>
        </li>
    );
}

import React, { useContext, useEffect } from "react";
import MultipleChoice from "./MultipleChoice";
import CheckBox from "./CheckBox";
import Written from "./Written";
import { ImBin2 } from "react-icons/im";
import { FormContext } from "@/utilities/FormProvider";

//TODO => Fix deleting mechanisim
export default function Question({ questionId }) {
    const [choice, setChoice] = React.useState("multiple_choice");
    const formContext = useContext(FormContext);

    return (
        <li
            className="w-[40rem] p-2 rounded-lg shadow-lg bg-gray-100 my-5"
            key={questionId}
        >
            <div className="p-2 flex flex-row justify-end mb-3">
                <button
                    className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
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
                />
                <select
                    className="ring-1 ring-blue-300 focus:ring-1 focus:ring-blue-500 rounded-md p-1.5"
                    onChange={(e) => setChoice(e.target.value)}
                >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="check_box">Check Box</option>
                    <option value="written">Written</option>
                </select>
            </div>
            <div id="choices" className="mt-3 p-2">
                {choice === "multiple_choice" && <MultipleChoice />}
                {choice === "check_box" && <CheckBox />}
                {choice === "written" && <Written />}
            </div>
        </li>
    );
}

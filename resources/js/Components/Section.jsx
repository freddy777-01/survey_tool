import React from "react";
import { FormContext } from "@/utilities/FormProvider";
import { RxCross2 } from "react-icons/rx";
import { FaGreaterThan } from "react-icons/fa6";

export default function Section({ section }) {
    const formContext = React.useContext(FormContext);
    // console.log(section.name);

    return (
        <li
            className="flex flex-row justify-between items-center p-2 gap-x-3 shadow-md rounded-lg"
            key={section.id}
        >
            <div className="text-lg font-semibold ">
                <input
                    type="text"
                    value={
                        section.name === ""
                            ? "Section " + section.number
                            : "" + section.name
                    }
                    className="w-[7rem] rounded-lg px-1 border-none focus:outline-none focus:ring-1 focus:ring-blue-300"
                    onChange={(e) =>
                        formContext.editSectionName(section.id, e.target.value)
                    }
                />
                {/* Section {section.number} */}
            </div>
            <button
                className=" bg-blue-300 hover:bg-blue-400 text-white p-1 rounded-md cursor-pointer"
                onClick={() => formContext.removeSection(section.id)}
            >
                <RxCross2 />
            </button>
        </li>
    );
}

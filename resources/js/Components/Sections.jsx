import React from "react";

import { RxCross2 } from "react-icons/rx";
import { FaGreaterThan } from "react-icons/fa6";
import { FormContext } from "@/utilities/FormProvider";

export default function Sections() {
    const formContext = React.useContext(FormContext);

    return (
        <div className="p-2">
            {formContext.getSections().length > 0 && (
                <>
                    <p className="text-2xl mb-5">Sections</p>
                    <ul>
                        {formContext.getSections().map((section) => (
                            <li
                                className="flex flex-row justify-between items-center p-2 gap-x-3 shadow-md rounded-lg"
                                key={section.id}
                            >
                                {/* <span className="text-gray-400 p-1 text-md rounded-full">
                                    <FaGreaterThan />
                                </span> */}
                                <span className="text-lg font-semibold">
                                    Section {section.number}
                                </span>
                                <button
                                    className=" bg-blue-300 hover:bg-blue-400 text-white p-1 rounded-md cursor-pointer"
                                    onClick={() =>
                                        formContext.removeSection(section.id)
                                    }
                                >
                                    <RxCross2 />
                                </button>
                            </li>
                        ))}
                        {/* <li>section one</li> */}
                    </ul>
                </>
            )}
        </div>
    );
}

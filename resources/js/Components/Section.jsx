import React from "react";
import { FormContext } from "@/utilities/FormProvider";
import { RxCross2 } from "react-icons/rx";
import { FaGreaterThan } from "react-icons/fa6";
import { Button } from "@/Components/ui/button";

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
                        formContext.editSectionName(
                            section.section_uid,
                            e.target.value
                        )
                    }
                />
                {/* Section {section.number} */}
            </div>
            <Button
                variant="ghost"
                size="sm"
                className="p-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => formContext.removeSection(section.section_uid)}
            >
                <RxCross2 className="w-4 h-4" />
            </Button>
        </li>
    );
}

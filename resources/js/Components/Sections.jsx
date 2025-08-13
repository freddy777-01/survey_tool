import React from "react";

import { TiEqualsOutline } from "react-icons/ti";
import { RxCross2 } from "react-icons/rx";
import { FaGreaterThan } from "react-icons/fa6";
import { FormContext } from "@/utilities/FormProvider";
import Section from "./Section";

export default function Sections() {
    const formContext = React.useContext(FormContext);

    return (
        <div className="p-2">
            {formContext.getSections().length > 0 && (
                <>
                    <p className="text-2xl mb-2 p-2 text-gray-600 flex gap-x-1 items-center">
                        {/* <TiEqualsOutline /> */}
                        <span>Sections</span>
                    </p>
                    <ul>
                        {formContext.getSections().map((section) => (
                            <Section
                                section={section}
                                key={section.section_uid}
                            />
                        ))}
                        {/* <li>section one</li> */}
                    </ul>
                </>
            )}
        </div>
    );
}

import React from "react";
import { FormContext } from "@/utilities/FormProvider";
import moment from "moment";

// Utility function to generate unique IDs
let idCounter = 0;
const generateUniqueId = () => {
    idCounter += 1;
    return moment().valueOf() + idCounter;
};

export default function SimpleLikertScale({ questionId, choice, formMode }) {
    const formContext = React.useContext(FormContext);

    const [likertScale, setLikertScale] = React.useState([
        {
            id: generateUniqueId(),
            name: "strongly_agree",
            value: "Strongly Agree",
        },
        { id: generateUniqueId(), name: "agree", value: "Agree" },
        { id: generateUniqueId(), name: "not_sure", value: "Not sure" },
        { id: generateUniqueId(), name: "disagree", value: "Disagree" },
        {
            id: generateUniqueId(),
            name: "strongly_disagree",
            value: "Strongly Disagree",
        },
    ]);

    React.useEffect(() => {
        formContext.changeAnswerStructure(questionId, choice, likertScale);
    }, [choice, likertScale, questionId]);

    return (
        <div>
            <div className="flex flex-row gap-x-5 items-center p-2 text-sm">
                {likertScale.map((scale, index) => (
                    <div className="flex gap-x-1.5" key={index}>
                        <input
                            type="radio"
                            value={scale.value}
                            name={"likert_scale"}
                            className="cursor-pointer h-5 w-5 border focus:outline-none border-slate-300 transition-all checked:bg-blue-300 focus:ring-1 rounded-md p-1.5"
                            id={questionId + scale.name}
                            disabled={
                                formMode === "create" || formMode === "edit"
                                    ? true
                                    : false
                            }
                        />
                        <label
                            htmlFor={questionId + scale.name}
                            className="hover:cursor-pointer"
                        >
                            {scale.value}
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}

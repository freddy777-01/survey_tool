import React from "react";
import { RxCross2 } from "react-icons/rx";
import { CgAddR } from "react-icons/cg";
import { FormContext } from "@/utilities/FormProvider";

export default function YesNo({ questionId, choice, formMode }) {
    const formContext = React.useContext(FormContext);
    const [choices, setChoices] = React.useState([
        { name: "yes", value: "Yes" },
        { name: "no", value: "No" },
    ]);

    let updateChoices = () => {};
    let addChoice = (choice) => {
        setChoices([...choices, choice]);
    };

    React.useEffect(() => {
        formContext.changeAnswerStructure(questionId, choice, choices);
    }, [choice]);

    return (
        <div>
            <ul className="flex flex-row gap-x-1.5 items-center p-2">
                {choices.map((choice, index) => (
                    <li
                        className="gap-x-1.5 flex items-center justify-start"
                        key={index}
                    >
                        <input
                            id={choice.name}
                            type="radio"
                            value={choice.value}
                            name={"yes_no"}
                            className="cursor-pointer h-5 w-5 border border-slate-300 transition-all checked:border-blue-300 focus:ring-1 rounded-md p-1.5"
                            disabled={
                                formMode === "create" || formMode === "edit"
                                    ? true
                                    : false
                            }
                        />
                        <label
                            htmlFor={choice.name}
                            className="hover:cursor-pointer"
                        >
                            {choice.value}
                        </label>
                        {/* <div className="flex gap-x-1.5">
                        </div> */}
                    </li>
                ))}
            </ul>
        </div>
    );
}

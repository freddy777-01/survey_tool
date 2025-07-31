import React from "react";
import { RxCross2 } from "react-icons/rx";
import { CgAddR } from "react-icons/cg";

export default function YesNo({ questionId }) {
    const [choices, setChoices] = React.useState([{ value: "option1" }]);

    let updateChoices = () => {};
    let addChoice = (choice) => {
        setChoices([...choices, choice]);
    };

    return (
        <div>
            <ul className="">
                {choices.map((choice, index) => (
                    <li
                        className="flex flex-row gap-x-5 justify-start items-center p-2"
                        key={index}
                    >
                        <div className="flex gap-x-1.5">
                            <input
                                id="yes"
                                type="radio"
                                value={choice.value}
                                name={"yes_no"}
                                className="cursor-pointer h-5 w-5 border border-slate-300 transition-all checked:border-blue-300 focus:ring-1 rounded-md p-1.5"
                                disabled={true}
                            />
                            <label htmlFor="yes">Yes</label>
                        </div>
                        <div className="flex gap-x-1.5">
                            <input
                                id="no"
                                type="radio"
                                value={choice.value}
                                name={"yes_no"}
                                className="cursor-pointer h-5 w-5 border border-slate-300 transition-all checked:border-blue-300 focus:ring-1 rounded-md p-1.5"
                            />
                            <label htmlFor="no">No</label>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

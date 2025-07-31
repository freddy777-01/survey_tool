import React from "react";

import { RxCross2 } from "react-icons/rx";
import { CgAddR } from "react-icons/cg";

export default function LikertScale({ questionId }) {
    const [choices, setChoices] = React.useState([{ value: "option1" }]);
    const [likertScale, setLikertScale] = React.useState([
        { name: "strongly_agree", value: "Strongly Agree" },
        { name: "agree", value: "Agree" },
        { name: "not_sure", value: "Not sure" },
        { name: "disagree", value: "Disagree" },
        { name: "strongly_disagree", value: "Strongly Disagree" },
    ]);

    // let questionId = questionId;
    let updateChoices = () => {};
    let addChoice = (choice) => {
        setChoices([...choices, choice]);
    };
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
                            id={scale.name}
                            disabled={true}
                        />
                        <label htmlFor={scale.name}>{scale.value}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}

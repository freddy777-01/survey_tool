import React from "react";
import { RxCross2 } from "react-icons/rx";
import { CgAddR } from "react-icons/cg";
import moment from "moment";

export default function CheckBox({ questionId }) {
    const [choices, setChoices] = React.useState([
        { id: moment().valueOf(), name: "check_box", value: "option1" },
    ]);
    let updateChoices = () => {};
    let addChoice = (choice) => {
        setChoices([...choices, choice]);
    };
    return (
        <div>
            <ul className="">
                {choices.map((choice, index) => (
                    <li
                        className="flex flex-row justify-between items-center p-2"
                        key={choice.id}
                    >
                        <div className="flex">
                            <input
                                type="checkbox"
                                value={choice.value}
                                name={"check_box"}
                                className="cursor-pointer h-5 w-5 border border-slate-300 transition-all checked:border-blue-300 focus:ring-1 rounded-md p-1.5"
                                disabled={true}
                            />
                            <input
                                type="text"
                                className="focus:outline-none mx-2 border-b-1"
                                placeholder="label..."
                                value={choice.value}
                                onChange={(e) => {
                                    const newChoices = [...choices];
                                    newChoices[index].value = e.target.value;
                                    setChoices(newChoices);
                                    updateChoices(newChoices);
                                }}
                            />
                        </div>
                        <button
                            className="ml-2 p-1 rounded-md text-black hover:bg-gray-200 transition-colors cursor-pointer"
                            onClick={() => {
                                const newChoices = choices.filter(
                                    (_c, i) => _c.id !== choice.id
                                );
                                setChoices(newChoices);
                                updateChoices(newChoices);
                            }}
                        >
                            <RxCross2 />
                        </button>
                    </li>
                ))}
            </ul>
            <div id="choices" className="mt-2">
                <button
                    className="flex flex-row justify-between items-center p-1 bg-blue-300 rounded-md shadow-md hover:bg-blue-400 transition-colors cursor-pointer"
                    onClick={() =>
                        addChoice({
                            id: moment().valueOf(),
                            name: "check_box",
                            value: `option${choices.length + 1}`,
                        })
                    }
                >
                    <CgAddR className="mx-auto" title="" />
                    <span className="text-gray-700 font-semibold mx-2">
                        Add option
                    </span>
                </button>
            </div>
        </div>
    );
}

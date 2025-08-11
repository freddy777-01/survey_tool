import React from "react";
import Layout from "../Layout";
import ActionBar from "@/Components/ActionBar";
import Question from "@/Components/Question";
import { FormContext, FormProvider } from "@/Utilities/FormProvider";
import { TbZoomQuestion } from "react-icons/tb";
import Sections from "@/Components/Sections";
import { ToastContainer, toast } from "react-toastify";
import { MdEditNote } from "react-icons/md";
import DatePicker from "../../Components/DatePicker";

//TODO => then finish setting the start and end time for the survey.
//TODO=> complete editing functionality
export default function Edit({ form }) {
    const formContext = React.useContext(FormContext);
    const [formTitle, setFormTitle] = React.useState("");
    const [questions, setQuestions] = React.useState([]);
    const [startDate, setStartDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");
    const [formMode, setFormMode] = React.useState("edit");

    console.log(form);

    const setSectionQuestions = () => {
        if (form.sections.length > 0) {
        }
    };
    React.useEffect(() => {
        formContext.setFormMode("edit");
        formContext.alterFormState(form);
        formContext.setFormMode("edit");
    }, []);

    const sectionMapping = (sectionUID) => {
        if (form.sections.length > 0) {
            let s = {
                id: "",
                name: "",
                number: "",
                description: "Section Description",
                questions: [],
            };
            form.sections.forEach((section, index) => {
                if (sectionUID == section.section_uid) {
                    s.id = sectionUID;
                    s.name = section.name;
                    s.questions = section.questions;
                    s.number = index + 1;
                }
            });
            return s;
        }
        return {};
    };
    return (
        <div className="p-5">
            <ToastContainer position="top-center" />
            <div className="fixed top-0 left-0 z-10 pt-4  w-full h-[4rem] mb-[5rem] flex justify-center items-center">
                <ActionBar toast={toast} />
            </div>
            <div className="absolute  max-md:left-[7rem] top-[7rem] left-[6rem] rounded-md">
                <Sections />
            </div>
            <div className="rounded-md shadow-md absolute right-2 top-[7rem] w-auto p-2">
                <p className="my-1">Timeline</p>
                <div className="flex gap-x-2">
                    <DatePicker
                        placeholder="Start"
                        name="start_date"
                        id="start_date"
                        value={startDate}
                        onChange={setStartDate}
                    />
                    <span>to</span>
                    <DatePicker
                        placeholder="End"
                        name="end_date"
                        id="end_date"
                        value={endDate}
                        onChange={setEndDate}
                    />
                </div>
            </div>
            <Layout>
                <div className="mt-[2.5rem]" id="survey-form">
                    <div className="w-[40rem] p-2 rounded-lg shadow-lg bg-gray-100">
                        <div className="flex justify-between items-center">
                            <div className="text-left text-gray-500 p-2">
                                <span className="text-black font-semibold mr-4">
                                    Title :
                                </span>{" "}
                                <input
                                    type="text"
                                    className="focus:outline-none focus:ring-blue-300 focus:ring-1  rounded-md p-1.5 w-[25rem]"
                                    value={formContext._formTitle()}
                                    placeholder="write here..."
                                    onChange={(e) =>
                                        formContext._setFormTitle(
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                            <button
                                className="flex flex-row gap-x-1 items-center text-white font-semibold p-1 px-1 rounded-lg bg-blue-400 hover:bg-blue-500 cursor-pointer transition-colors"
                                onClick={() =>
                                    formContext._setIsFormDescription(
                                        !formContext._isFormDescription()
                                    )
                                }
                            >
                                <MdEditNote className="text-xl" />
                                {/* <span> Description</span> */}
                            </button>
                        </div>
                        <div className="flex flex-row items-end mt-5">
                            {(formContext._isFormDescription() ||
                                formContext._formDescription() != "") && (
                                <textarea
                                    cols={70}
                                    rows={2}
                                    placeholder="write here...."
                                    value={formContext._formDescription()}
                                    onChange={(e) =>
                                        formContext._setFormDescription(
                                            e.target.value
                                        )
                                    }
                                    className="resize-none focus:outline-none ring-1 ring-blue-300 focus:ring-1 focus:ring-blue-500 rounded-md p-1.5 italic text-gray-500"
                                    // disabled={true}
                                ></textarea>
                            )}
                        </div>
                    </div>
                    <div className="mt-5">
                        {/* <p className="text-left text-gray-500 p-1">Questions</p> */}

                        {formContext.getFormQuestions().length > 0 ? (
                            <ul id="questions" className="">
                                {formContext.getFormQuestions().map((q) => (
                                    // (q, index) => console.log(q.id)

                                    <Question
                                        questionId={q.id}
                                        key={q.id}
                                        question={q}
                                        questionChoice={q.answer.type}
                                        defaultSection={sectionMapping(
                                            q.section_uid
                                        )}
                                        // {...console.log(q)}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <div className="flex gap-x-3 items-center justify-center p-5 text-gray-400 text-shadow-2xs  rounded-md">
                                <span className=" mx-2 ">
                                    {" "}
                                    add Questions.....
                                </span>

                                <TbZoomQuestion />
                            </div>
                        )}
                    </div>
                </div>
            </Layout>
        </div>
    );
}

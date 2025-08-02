import React, { useEffect } from "react";
import Layout from "./Layout";
import ActionBar from "@/Components/ActionBar";
import Question from "@/Components/Question";
import { FormContext, FormProvider } from "@/Utilities/FormProvider";
import { TbZoomQuestion } from "react-icons/tb";
import Sections from "../Components/Sections";
import { ToastContainer, toast } from "react-toastify";

//TODO => create a saving button here
/**
 *
 * THe saving button will appear if there are questions on the form, either, the button will be disabled or hidden
 */
function welcome() {
    return (
        <FormProvider>
            <Form />
        </FormProvider>
    );
}

function Form() {
    const formContext = React.useContext(FormContext);
    const [formTitle, setFormTitle] = React.useState("");
    const [questions, setQuestions] = React.useState([]);

    /* useEffect(() => {
        // console.log(formContext.formQuestions);
        // setQuestions(formContext.getFormQuestions());
    }, [formContext.formQuestions]); */

    return (
        <div className="p-5">
            <ToastContainer position="top-center" />
            <div className="fixed top-0 left-0 z-10 pt-4  w-full h-[4rem] mb-[5rem] flex justify-center items-center">
                <ActionBar toast={toast} />
            </div>
            <div className="absolute  max-md:left-[7rem] top-[7rem] left-[6rem] rounded-md">
                <Sections />
            </div>
            <Layout>
                <div className="mt-[2.5rem]" id="survey-form">
                    <div className=" w-[40rem] p-2 rounded-lg shadow-lg bg-gray-100">
                        <p className="text-left text-gray-500 p-2">
                            <span className="text-black font-semibold">
                                Title :
                            </span>{" "}
                            {formTitle ? formTitle : "................."}
                        </p>
                        <div className="p-2">
                            <input
                                type="text"
                                className="focus:outline-none ring-1 ring-blue-300 focus:ring-1 focus:ring-blue-500 rounded-md p-1.5"
                                value={formTitle}
                                placeholder="write here..."
                                onChange={(e) => setFormTitle(e.target.value)}
                            />
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
                                        content={q}
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

export default welcome;

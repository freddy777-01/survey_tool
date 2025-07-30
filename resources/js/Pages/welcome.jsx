import React from "react";
import Layout from "./Layout";
import ActionBar from "@/Components/ActionBar";
import Question from "@/Components/Question";
import { FormContext, FormProvider } from "@/Utilities/FormProvider";

function welcome() {
    return (
        <FormProvider>
            <Form />
        </FormProvider>
    );
}

function Form() {
    const [formTitle, setFormTitle] = React.useState("");
    const [questions, setQuestions] = React.useState([]);
    const formContext = React.useContext(FormContext);
    return (
        <div className="p-5">
            <ActionBar />
            <Layout>
                <div className="" id="survey-form">
                    <div className=" w-[40rem] p-2 rounded-lg shadow-lg bg-gray-100">
                        <p className="text-left text-gray-500 p-2">
                            {formTitle ? formTitle : "Form Title"}
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
                        <p className="text-left text-gray-500 p-1">Questions</p>
                        {formContext.formQuestions.length > 0 ? (
                            <ul id="questions" className="">
                                {formContext.formQuestions.map(
                                    (question, index) => (
                                        <Question questionId={question.id} />
                                    )
                                )}
                            </ul>
                        ) : (
                            <div className="">Create Questions</div>
                        )}
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default welcome;

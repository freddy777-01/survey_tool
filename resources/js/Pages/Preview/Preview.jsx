import React, { useEffect } from "react";
import { FormContext, FormProvider } from "@/utilities/FormProvider";
import { ToastContainer } from "react-toastify";
import Layout from "../Layout";
import MultipleChoice from "../../Components/MultipleChoice";
import Question from "../../Components/Question";

//TODO : Complete preview page
//TODO : In case there are sections some question sections are placed on their specific file
const Preview = ({ form }) => {
    const formContext = React.useContext(FormContext);
    // const [formState, setFormState] = React.useState(form.form);
    const [formMode, setFormMode] = React.useState("preview");
    useEffect(() => {
        // setFormState(form.form);
        formContext._setFormState(form);
        formContext.setFormMode("preview");
        formContext.setFormQuestions(form.questions);
        formContext.setFormUID(form.form_uid);
    }, []);
    let formState = form;

    console.log(formState);
    return (
        <FormProvider>
            <Layout>
                <div className=" w-[40rem] p-2 rounded-lg shadow-lg bg-gray-100">
                    <p className="text-left text-gray-500 p-2">
                        <span className="text-black font-semibold">
                            Title :
                        </span>{" "}
                        <span>{formState.form.name}</span>
                    </p>
                </div>
                <div className="p-2 mt-5">
                    <div className="flex flex-col gap-y-3">
                        {formState.sections.length > 0
                            ? formState.sections.map((section) => (
                                  <div key={section.section_uid}>
                                      <div className="flex flex-row items-start border w-[40rem]">
                                          <p className="border p-2 rounded-md bg-blue-400 text-white">
                                              {section.name}
                                          </p>
                                      </div>
                                      {formState.questions.map(
                                          (question) =>
                                              question.section_id ===
                                                  section.id && (
                                                  <div
                                                      className="border p-2"
                                                      key={section.section_uid}
                                                  >
                                                      <p className="text-lg font-semibold">
                                                          {question.question}
                                                      </p>
                                                      {question.description && (
                                                          <p className="text-gray-600">
                                                              {
                                                                  question.description
                                                              }
                                                          </p>
                                                      )}
                                                      {/* Render question type based on choice */}
                                                      {question.choice ===
                                                          "written" && (
                                                          <textarea
                                                              className="resize-none focus:outline-none ring-1 ring-blue-300 focus:ring-1 focus:ring-blue-500 rounded-md p-1.5"
                                                              disabled={true}
                                                          ></textarea>
                                                      )}
                                                      {/* Add other question types here */}
                                                  </div>
                                              )
                                      )}
                                  </div>
                              ))
                            : formState.questions.map((question) => {
                                  //   console.log(question.answers[0].type);

                                  return (
                                      <Question
                                          choic={question.answer.type}
                                          content={question}
                                          formMode={formMode}
                                          questionId={question.question_uid}
                                      />
                                  );
                              })}
                    </div>
                </div>
            </Layout>
        </FormProvider>
    );
};

export default Preview;

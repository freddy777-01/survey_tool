import React, { useEffect } from "react";
import { FormContext, FormProvider } from "@/utilities/FormProvider";
import { ToastContainer } from "react-toastify";
import Layout from "../Layout";
import MultipleChoice from "../../Components/MultipleChoice";
import Question from "../../Components/Question";
import Written from "../../Components/Written";
import YesNo from "../../Components/YesNo";
import LikertScale from "../../Components/LikertScale";
import { LuRefreshCw } from "react-icons/lu";
import { router } from "@inertiajs/react";
import CheckBox from "../../Components/CheckBox";

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
                <div className="flex w-full justify-end my-3">
                    <button
                        className=" p-2 rounded-md bg-blue-400 hover:bg-blue-500 text-white flex items-center gap-x-2 hover:cursor-pointer"
                        onClick={() => router.reload({ preserveState: true })}
                    >
                        <LuRefreshCw />
                        <span>Refresh</span>
                    </button>
                </div>
                <div className=" w-[40rem] p-2 rounded-lg shadow-md">
                    <p className="text-left text-black p-2">
                        <span className="text-black font-semibold">
                            Title :
                        </span>{" "}
                        <span>{formState.form.name}</span>
                    </p>
                    <p className="text-left text-gray-500 p-2 italic">
                        <span>{formState.form.description}</span>
                    </p>
                </div>
                <div className="p-2 mt-5">
                    <div
                        className="flex flex-col gap-y-3"
                        key={formState.form.form_uid}
                    >
                        {formState.sections.length > 0
                            ? formState.sections.map((section) => (
                                  <div key={section.section_uid}>
                                      <div className="flex flex-row items-start  w-[40rem]">
                                          <p className=" p-2 px-7 rounded-tl-md rounded-tr-md bg-blue-400 text-white">
                                              {section.name}
                                          </p>
                                      </div>
                                      <div className=" rounded-br-md rounded-bl-md shadow-md p-1">
                                          {section.questions.map((question) => (
                                              <div
                                                  className="p-2"
                                                  key={question.question_uid}
                                              >
                                                  <p className="text-lg font-semibold my-3">
                                                      {question.question}
                                                  </p>
                                                  {question.description && (
                                                      <p className="text-gray-600 my-3">
                                                          {question.description}
                                                      </p>
                                                  )}
                                                  {question.answer.type ===
                                                      "multiple_choice" && (
                                                      <MultipleChoice
                                                          questionId={
                                                              question.id
                                                          }
                                                          formMode={formMode}
                                                          structure={
                                                              question.answer
                                                                  .structure
                                                          }
                                                      />
                                                  )}
                                                  {question.answer.type ===
                                                      "check_box" && (
                                                      <CheckBox
                                                          questionId={
                                                              question.id
                                                          }
                                                          formMode={formMode}
                                                          structure={
                                                              question.answer
                                                                  .structure
                                                          }
                                                      />
                                                  )}
                                                  {question.answer.type ===
                                                      "written" && (
                                                      <Written
                                                          choice={
                                                              question.answer
                                                                  .type
                                                          }
                                                          questionId={
                                                              question.question_uid
                                                          }
                                                          formMode={formMode}
                                                          structure={
                                                              question.answer
                                                                  .structure
                                                          }
                                                      />
                                                  )}
                                                  {question.answer.type ===
                                                      "yes_no" && (
                                                      <YesNo
                                                          choice={
                                                              question.answer
                                                                  .type
                                                          }
                                                          questionId={
                                                              question.question_uid
                                                          }
                                                          formMode={formMode}
                                                          structure={
                                                              question.answer
                                                                  .structure
                                                          }
                                                      />
                                                  )}
                                                  {question.answer.type ===
                                                      "likert_scale" && (
                                                      <LikertScale
                                                          choice={
                                                              question.answer
                                                                  .type
                                                          }
                                                          questionId={
                                                              question.question_uid
                                                          }
                                                          formMode={formMode}
                                                          structure={
                                                              question.answer
                                                                  .structure
                                                          }
                                                      />
                                                  )}
                                              </div>
                                          ))}
                                      </div>
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

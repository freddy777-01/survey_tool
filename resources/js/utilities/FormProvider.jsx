import moment from "moment";
import React from "react";

const FormContext = React.createContext();

function FormProvider({ children }) {
    const [formQuestions, setFormQuestions] = React.useState([]);
    const [sections, addSections] = React.useState([]);

    const addSection = () => {
        // adding section
        let section = {
            id: moment().valueOf(),
            title: sections.length + 1,
            description: "Section Description",
            questions: [],
        };
        addSections((sections) => [...sections, section]);
    };

    const addFormQuestion = () => {
        // creating question instance
        let question = {
            id: moment().valueOf(),
            q: "",
            answer: {
                type: "multiple_choice",
                structure: [
                    {
                        id: moment().valueOf(),
                        name: "multiple_choice",
                        value: `option${formQuestions.length + 1}`,
                    },
                ],
            },
        };
        setFormQuestions((formQuestions) => [...formQuestions, question]);
    };

    const writeQuestion = (questionId, qn) => {
        // updating or writing new question
        let updatedQuestions = formQuestions.map((q) => {
            if (q.id === questionId) {
                q.q = qn;
            }
            return q;
        });
        setFormQuestions(updatedQuestions);
    };

    const addQuestionChoice = (questionId, type) => {
        let newQuestions = formQuestions.map((q, i) => {
            if (q.id === questionId) {
                q.answer.structure.push({
                    id: moment().valueOf(),
                    name: type,
                    value: `option${q.answer.structure.length + 1}`,
                });
            }
            return q;
        });
        setFormQuestions(newQuestions);
    };

    const removeFormQuestion = (id) => {
        // removing a question from the form

        let newQuestions = formQuestions.filter((q) => q.id !== id);
        setFormQuestions(newQuestions);
        // console.log(newQuestions);
    };

    const changeQuestionType = (qContent) => {
        /* If question type is equal to written, then structure = null  */
        let newQuestions = formQuestions.map((q) => {
            if (q.id === qContent.id) {
                q.answer.type = "yes_no";
            }
            return q;
        });
        setFormQuestions(newQuestions);
    };

    const removeQuestionChoice = (questionId, choiceId) => {
        // removes a question choice in case of multiple choices.
        let updatedQuestions = formQuestions.map((q) => {
            if (q.id === questionId) {
                q.answer.structure = q.answer.structure.filter(
                    (c) => c.id !== choiceId
                );
            }
            return q;
        });
        setFormQuestions(updatedQuestions);
    };

    const changeChoiceLabel = (questionId, choiceId, value) => {
        // changing the label of the question
        let updatedQuestions = formQuestions.map((q) => {
            if (q.id === questionId) {
                q.answer.structure = q.answer.structure.map((c) => {
                    if (c.id === choiceId) {
                        c.value = value;
                    }
                    return c;
                });
            }
            return q;
        });
        setFormQuestions(updatedQuestions);
    };

    return (
        <FormContext.Provider
            value={{
                addFormQuestion,
                removeFormQuestion,
                formQuestions,
                writeQuestion,
                addQuestionChoice,
                removeQuestionChoice,
                changeChoiceLabel,
            }}
        >
            {children}
        </FormContext.Provider>
    );
}

export { FormContext, FormProvider };

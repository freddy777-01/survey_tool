import React from "react";

const FormContext = React.createContext();

function FormProvider({ children }) {
    const [formQuestions, setFormQuestions] = React.useState([]);

    let addFormQuestion = (question) => {
        setFormQuestions((prevQuestions) => [...prevQuestions, question]);
    };
    let removeFormQuestion = (id) => {
        setFormQuestions((prevQuestions) =>
            prevQuestions.filter((question) => question.id !== id)
        );
    };
    // let questions = formQuestions;

    return (
        <FormContext.Provider
            value={{ addFormQuestion, removeFormQuestion, formQuestions }}
        >
            {children}
        </FormContext.Provider>
    );
}

export { FormContext, FormProvider };

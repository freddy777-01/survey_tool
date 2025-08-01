import moment from "moment";
import React from "react";

const FormContext = React.createContext();

//TODO => question structure state in Question component should be global state.
//TODO => The form should have a description... state description should be in formProvider
//TODO => Complete section functionality,
function FormProvider({ children }) {
    const [formQuestions, setFormQuestions] = React.useState([]);
    const [sections, addSections] = React.useState([]);
    const [formDescription, setFormDescription] = React.useState("");

    const addFormDescription = (d) => setFormDescription(d);
    const getFormDescription = () => formDescription;
    const getFormQuestions = () => formQuestions;

    //Dealing with sections
    const addSection = () => {
        // adding section
        let id = moment().valueOf();
        let section = {
            id,
            number: sections.length + 1,
            description: "Section Description",
            questions: [],
        };
        addSections((sections) => [...sections, section]);
    };
    const addQuestionToSection = (questionId, sectionId) => {
        if (sectionId == 0) return;
        // console.log("Section Id :" + sectionId);
        let updatedSections = sections.map((section) => {
            section.questions = section.questions.filter(
                (qId) => qId !== questionId
            );
            if (section.id == sectionId) {
                section.questions.push(questionId);
            }
            return section;
        });
        addSections(updatedSections);

        // console.log(sections);
    };
    const removeSection = () => {
        //TODO => Complete this function
    };
    // End of sections

    const addFormQuestion = () => {
        // creating question instance, and adding it to formQuestions
        /*  console.log(
            "Current FormQuestions :" +
                formQuestions +
                "question Id :" +
                moment().valueOf()
        ); */
        let id = moment().valueOf();

        let question = {
            id,
            q: "",
            answer: {
                type: "multiple_choice",
                structure: [],
            },
        };
        // let newQuestions = formQuestions.push(question)
        setFormQuestions([...formQuestions, question]);

        // console.log("New question list" + formQuestions);
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
        let id = moment().valueOf();
        let newQuestions = formQuestions.map((q, i) => {
            if (q.id === questionId) {
                q.answer.structure.push({
                    id,
                    name: type,
                    value: `option${q.answer.structure.length + 1}`,
                });
                /* if (Array.isArray(q.answer.structure)) {
                } */
            }
            return q;
        });
        setFormQuestions(newQuestions);
    };

    const removeFormQuestion = (id) => {
        // removing a question from the form

        let newQuestions = formQuestions.filter((q) => q.id !== id);

        // removing the question from the section also
        let updateSections = sections.map((section) => {
            section.questions = section.questions.filter((qId) => qId !== id);
            return section;
        });
        addSections(updateSections);
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
        // removes a question choice in case of multiple choices or check box.
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

    const changeAnswerStructure = (
        questionId,
        answerStructureType,
        answerStructure
    ) => {
        // changes question's answer structure, maintains qn's ans structures that are alike.
        // console.log("Ans type : " + answerStructureType);
        // console.log("Ans structure type : " + answerStructureType);

        let updatedQuestions = formQuestions.map((q) => {
            if (q.id === questionId) {
                if (
                    answerStructureType === "multiple_choice" &&
                    q.answer.type === "check_box"
                ) {
                    q.answer.type = answerStructureType;
                    return q;
                }
                if (
                    answerStructureType === "check_box" &&
                    q.answer.type === "multiple_choice"
                ) {
                    q.answer.type = answerStructureType;
                    return q;
                } else {
                    q.answer.type = answerStructureType;
                    q.answer.structure = answerStructure;
                    return q;
                }
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
                // formQuestions,
                writeQuestion,
                addQuestionChoice,
                removeQuestionChoice,
                changeChoiceLabel,
                changeAnswerStructure,
                getFormQuestions,
                //sections
                addSection,
                getSections: () => sections,
                addQuestionToSection,
            }}
        >
            {children}
        </FormContext.Provider>
    );
}

export { FormContext, FormProvider };

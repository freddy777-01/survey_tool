import Joi, { number } from "joi";
import moment from "moment";
import React from "react";

const FormContext = React.createContext();

/**
 *
 * The form will have form_uid, that will be used to update the form on the database,
 * will also be used to track changes and store them on local storage on the browser.
 *
 */

function FormProvider({ children }) {
    const [formQuestions, setFormQuestions] = React.useState([]);
    const [formUID, setFormUID] = React.useState("");
    const [sections, setSections] = React.useState([]);
    const [formDescription, setFormDescription] = React.useState("");
    const [formTitle, setFormTitle] = React.useState("");
    const [isFormDescription, setIsFormDescription] = React.useState(false);

    const [formState, setFormState] = React.useState({});

    const [formSavedStatus, setFormSavedStatus] = React.useState(false);

    const modeList = ["create", "edit", "preview"];
    const [formMode, setFormMode] = React.useState("create");

    React.useEffect(() => {
        // update the form object if it exits on browser history
        localStorage.clear();
        if (formMode == "create") {
            let form_uid = moment().valueOf();
            setFormUID(form_uid);
        }

        /* let form = JSON.parse(localStorage.getItem("form"));
        setFormState(form? form : []); */
    }, []);

    React.useEffect(() => {
        // Update the form object when some variables are changed
        setFormSavedStatus(false);

        let form = {
            form_uid: formUID,
            title: formTitle,
            description: formDescription,
            sections: sections,
            questions: formQuestions,
        };
        if (formUID != "") localStorage.setItem(formUID, JSON.stringify(form));
        setFormState(form);
    }, [formTitle, formDescription, formQuestions, sections]);

    /*
    *****From schema*****

     form = {
            title: formTitle,
            description: formDescription,
            sections: sections,
            questions: formQuestions,
        };

         section = {
            id,
            name: "",
            number: sections.length + 1,
            description: "Section Description",
            questions: [],
        };

        question = {
            id,
            question: "",
            section:"",
            description:""
            answer: {
                type: "multiple_choice", // If written structure will be empty array
                structure: [],
            },
        };
       structure = {
                    id,
                    name: type, //can be multi_choice/written/
                    value: `option${q.answer.structure.length + 1}`,
                }

    ****End of form schema*****
        */

    const _formState = () => formState;
    //End of form

    //Form save status

    // Form description
    const _isFormDescription = () => isFormDescription;
    const _setIsFormDescription = (d) => setIsFormDescription(d);
    const _setFormDescription = (d) => setFormDescription(d);
    const _formDescription = () => formDescription;
    // End of form description

    const getFormQuestions = () => formQuestions;

    // Form Title
    const _formTitle = () => formTitle;
    const _setFormTitle = (t) => setFormTitle(t);
    // End of form title

    //Dealing with sections
    const addSection = () => {
        // adding section
        let id = moment().valueOf();
        let section = {
            id,
            name: `Section ${sections.length + 1}`,
            number: sections.length + 1,
            description: "Section Description",
            questions: [],
        };
        setSections((sections) => [...sections, section]);
        // console.log(sections);
    };

    const addSectionToQuestion = (questionId, sectionId) => {
        let updatedQuestions = formQuestions.map((question) => {
            if (question.id == questionId) {
                question.section = sectionId;
            }
            return question;
        });
        setFormQuestions(updatedQuestions);
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
        setSections(updatedSections);

        // console.log(sections);
        addSectionToQuestion(questionId, sectionId);
    };

    const removeSectionFromQuestion = (sectionId) => {
        let updateQuestions = formQuestions.map((question) => {
            if (sectionId == question.section) {
                question.section = "";
            }
            return question;
        });
        setFormQuestions(updateQuestions);
    };
    const removeSection = (sectionId) => {
        let newSections = sections.filter(
            (section) => section.id !== sectionId
        );
        setSections(newSections);
        removeSectionFromQuestion(sectionId);
    };

    const checkEmptySections = () => {
        /**
         * This function will check if sections were created, check if the available questions are not assign to existing sections.
         * If sections are available, then each question has to be assigned to a section, If not, then the form will not be submitted.
         */

        let questionsNotInSections = [];
        let questionsInEitherSections = [];
        let sectionsWithNoQuestions = [];
        if (sections.length > 0) {
            // if sections are available
            sections.forEach((section) => {
                // let sectionQuestions = section.questions;
                for (let i = 0; i < section.questions.length; i++) {
                    questionsInEitherSections.push(section.questions[i]);
                }
                if (section.questions.length == 0) {
                    sectionsWithNoQuestions.push(section.id);
                }
            });
            formQuestions.forEach((q) => {
                if (!questionsInEitherSections.includes(q.id)) {
                    questionsNotInSections.push(q.id);
                }
            });
        }

        // return questionsNotInSections;
        return questionsNotInSections.length > 0 || questionsNotInSections > 0
            ? true
            : false;
    };

    const editSectionName = (sectionId, name) => {
        let updatedSections = sections.map((section) => {
            if (section.id == sectionId) {
                section.name = name;
            }
            return section;
        });
        setSections(updatedSections);
    };

    // End of sections

    // Dealing with questions
    const addFormQuestion = () => {
        // creating question instance, and adding it to formQuestions
        // console.log("adding question");

        /*  console.log(
            "Current FormQuestions :" +
                formQuestions +
                "question Id :" +
                moment().valueOf()
        ); */

        let id = moment().valueOf();

        let question = {
            id,
            question: "",
            section: "",
            description: "",
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
                q.question = qn;
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
        setSections(updateSections);
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
    // End dealing with questions

    // compiling data before saving
    const alterFormState = (form) => {
        let questions = [];
        setFormUID(form.form_uid);
        if (form.sections.length > 0) {
            let updateSections = form.sections.map((section) => {
                let questionsUIDs = [];
                section.questions.forEach((q) => {
                    questionsUIDs.push(q.question_uid);
                });
                section.questions = questionsUIDs;
                return section;
            });
            setSections(updateSections);
        }
        setFormTitle(form.name);
        setFormDescription(form.description);
        setFormQuestions(form.questions);
        setFormSavedStatus(false);

        setFormState(form);
    };
    const submitForm = () => {};
    // End of compiling data before saving
    return (
        <FormContext.Provider
            value={{
                addFormQuestion,
                removeFormQuestion,
                // formQuestions,
                setFormQuestions: (questions) => setFormQuestions(questions),
                writeQuestion,
                addQuestionChoice,
                removeQuestionChoice,
                changeChoiceLabel,
                changeAnswerStructure,
                getFormQuestions, // should also check if questions are available before saving the form
                //dealing with sections
                addSection,
                getSections: () => sections,
                addQuestionToSection,
                removeSection,
                editSectionName,
                checkEmptySections, // This will be called before save
                //end dealing with sections
                // form title
                _formTitle,
                _setFormTitle,
                // end of form title
                // Form description
                _isFormDescription,
                _setIsFormDescription,
                _setFormDescription,
                _formDescription,
                // End form description
                alterFormState, // This will be called on form edit page
                _formState,
                _setFormState: (f) => setFormState(f),
                //formUID
                getFormUID: () => formUID,
                setFormUID: (uid) => setFormUID(uid),

                //formSave status
                _formSavedStatus: () => formSavedStatus,
                _setFormSavedStatus: (s) => setFormSavedStatus(s),
                //Form Mode
                getFormMode: () => formMode,
                setFormMode: (mode) => setFormMode(mode),
            }}
        >
            {children}
        </FormContext.Provider>
    );
}

export { FormContext, FormProvider };

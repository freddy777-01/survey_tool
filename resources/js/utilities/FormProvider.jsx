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

function FormProvider({
    children,
    initialForm = null,
    initialMode = "create",
}) {
    const [formQuestions, setFormQuestions] = React.useState([]);
    const [formUID, setFormUID] = React.useState("");
    const [sections, setSections] = React.useState([]);
    const [formDescription, setFormDescription] = React.useState("");
    const [formTitle, setFormTitle] = React.useState("");
    const [isFormDescription, setIsFormDescription] = React.useState(false);

    const [beginDate, setBeginDate] = React.useState("");
    const [endDate, setEndDate] = React.useState("");

    const [formState, setFormState] = React.useState({});
    const [formSavedStatus, setFormSavedStatus] = React.useState(false);
    const [formMode, setFormMode] = React.useState(initialMode);
    const [isInitialized, setIsInitialized] = React.useState(false);
    const [publishedStatus, setPublishedStatus] = React.useState(false);

    // Initialize form based on mode and initial data
    React.useEffect(() => {
        if (initialMode === "create") {
            // Create mode: generate new form_uid
            const newFormUID = moment().valueOf();
            setFormUID(newFormUID);
            setFormSavedStatus(false);
        } else if (initialMode === "edit" && initialForm) {
            // Edit mode: load existing form data
            setFormUID(initialForm.main.form_uid);
            setFormTitle(initialForm.main.name || "");
            setFormDescription(initialForm.main.description || "");
            setBeginDate(initialForm.main.begin_date || "");
            setEndDate(initialForm.main.end_date || "");
            setFormQuestions(initialForm.questions || []);
            setPublishedStatus(initialForm.main.published || false);

            // Process sections if they exist
            if (initialForm.sections && initialForm.sections.length > 0) {
                const processedSections = initialForm.sections.map(
                    (section, index) => ({
                        id: section.id,
                        section_uid: section.section_uid,
                        name: section.name,
                        number: index + 1,
                        description: section.description || "",
                        questions: section.questions || [],
                        questions_uid: section.questions_uid || [],
                    })
                );
                setSections(processedSections);
            }

            setFormSavedStatus(true);
            setIsInitialized(true);
        } else if (initialMode === "preview" && initialForm) {
            // Preview mode: load form data for read-only display
            setFormUID(initialForm.form.form_uid);
            setFormTitle(initialForm.form.name || "");
            setFormDescription(initialForm.form.description || "");
            setBeginDate(initialForm.form.begin_date || "");
            setEndDate(initialForm.form.end_date || "");

            // Create a deep copy to prevent mutation
            const questionsCopy = JSON.parse(
                JSON.stringify(initialForm.questions || [])
            );

            setFormQuestions(questionsCopy);

            if (initialForm.sections && initialForm.sections.length > 0) {
                const processedSections = initialForm.sections.map(
                    (section) => ({
                        section_uid: section.section_uid,
                        name: section.name,
                        number: section.number || 1,
                        description:
                            section.description || "Section Description",
                        questions: section.questions || [],
                    })
                );
                setSections(processedSections);
            }

            setFormSavedStatus(true);
            setIsInitialized(true);
        } else if (initialMode === "preview" && !initialForm) {
            // Preview mode but initialForm is not available yet - wait for it
            return;
        }
    }, [initialMode, initialForm]);

    // Update localStorage only for create and edit modes, not preview
    React.useEffect(() => {
        if (formMode === "preview") {
            return;
        }

        if (formUID && formUID !== "") {
            let form = {
                form_uid: formUID,
                title: formTitle,
                description: formDescription,
                begin_date: beginDate,
                end_date: endDate,
                sections: sections,
                questions: formQuestions,
                mode: formMode,
            };

            localStorage.setItem(formUID, JSON.stringify(form));
            setFormState(form);
        }
    }, [
        formUID,
        formTitle,
        formDescription,
        beginDate,
        endDate,
        formQuestions,
        sections,
        formMode,
    ]);

    // Prevent localStorage from overriding backend data in preview mode
    React.useEffect(() => {
        if (formMode === "preview" && formUID && formUID !== "") {
            // Clear any existing localStorage data for this form in preview mode
            localStorage.removeItem(formUID);
        }
    }, [formMode, formUID]);

    // Track changes and reset saved status for both create and edit modes
    React.useEffect(() => {
        // Only reset saved status if we're not in preview mode and the form has been initialized
        if (formMode === "preview" || !isInitialized) {
            return;
        }

        // For create mode, always reset saved status when form changes
        if (formMode === "create" && formSavedStatus) {
            setFormSavedStatus(false);
        }
        // For edit mode, only reset if there are actual changes from the original data
        else if (formMode === "edit" && isInitialized && formSavedStatus) {
            // Check if there are actual changes by comparing with initial form data
            if (initialForm && initialForm.main) {
                const hasChanges =
                    formTitle !== (initialForm.main.name || "") ||
                    formDescription !== (initialForm.main.description || "") ||
                    beginDate !== (initialForm.main.begin_date || "") ||
                    endDate !== (initialForm.main.end_date || "") ||
                    JSON.stringify(formQuestions) !==
                        JSON.stringify(initialForm.questions || []) ||
                    JSON.stringify(sections) !==
                        JSON.stringify(initialForm.sections || []);

                if (hasChanges) {
                    setFormSavedStatus(false);
                }
            } else {
                // If no initial form data, reset on any change
                setFormSavedStatus(false);
            }
        }
    }, [
        formTitle,
        formDescription,
        formQuestions,
        sections,
        beginDate,
        endDate,
        formMode,
        isInitialized,
        formSavedStatus,
        initialForm,
    ]);

    // Form Title
    const _formTitle = () => formTitle;
    const _setFormTitle = (t) => setFormTitle(t);

    // Form Description
    const _isFormDescription = () => isFormDescription;
    const _setIsFormDescription = (d) => setIsFormDescription(d);
    const _setFormDescription = (d) => setFormDescription(d);
    const _formDescription = () => formDescription;

    // Timeline
    const _beginDate = () => beginDate;
    const _endDate = () => endDate;
    const _setBeginDate = (d) => setBeginDate(d);
    const _setEndDate = (d) => setEndDate(d);

    // Form Questions
    const getFormQuestions = () => formQuestions;

    // Form Initialization Status
    const getIsInitialized = () => isInitialized;

    // Form Mode
    const getFormMode = () => formMode;
    const setFormModeContext = (mode) => {
        setFormMode(mode);
    };

    // Form UID
    const getFormUID = () => formUID;
    const setFormUIDContext = (uid) => setFormUID(uid);

    // Form Save Status
    const _formSavedStatus = () => formSavedStatus;
    const _setFormSavedStatus = (s) => setFormSavedStatus(s);

    // Check if form has unsaved changes
    const _hasUnsavedChanges = () => {
        if (formMode === "preview") {
            return false;
        }

        if (formMode === "create") {
            return !formSavedStatus;
        }

        if (formMode === "edit" && initialForm && initialForm.main) {
            return (
                formTitle !== (initialForm.main.name || "") ||
                formDescription !== (initialForm.main.description || "") ||
                beginDate !== (initialForm.main.begin_date || "") ||
                endDate !== (initialForm.main.end_date || "") ||
                JSON.stringify(formQuestions) !==
                    JSON.stringify(initialForm.questions || []) ||
                JSON.stringify(sections) !==
                    JSON.stringify(initialForm.sections || [])
            );
        }

        return !formSavedStatus;
    };

    // Published Status
    const _publishedStatus = () => publishedStatus;
    const _setPublishedStatus = (s) => setPublishedStatus(s);

    // Form State
    const _formState = () => formState;
    const _setFormState = (f) => setFormState(f);

    //Dealing with sections
    const addSection = () => {
        // adding section
        let section_uid = moment().valueOf();
        let section = {
            section_uid,
            name: `Section ${sections.length + 1}`,
            number: sections.length + 1,
            description: "Section Description",
            questions: [],
            questions_uid: [],
        };
        setSections((sections) => [...sections, section]);
    };

    const addSectionToQuestion = (questionId, sectionId) => {
        let updatedQuestions = formQuestions.map((question) => {
            if (question.question_uid == questionId) {
                question.section_uid = sectionId;
            }
            return question;
        });
        setFormQuestions(updatedQuestions);
    };

    const addQuestionToSection = (questionId, sectionId) => {
        // If sectionId is empty or "0", remove question from all sections

        if (sectionId == 0) return;

        let updatedSections = sections.map((section) => {
            section.questions_uid = section.questions_uid.filter(
                //removing question to this section
                (qId) => qId !== questionId
            );

            if (section.section_uid == sectionId) {
                section.questions_uid.push(questionId);
            }

            return section;
        });
        setSections(updatedSections);

        addSectionToQuestion(questionId, sectionId);
    };

    const removeSectionFromQuestion = (sectionId) => {
        let updateQuestions = formQuestions.map((question) => {
            if (sectionId == question.section_uid) {
                question.section_uid = "";
            }
            return question;
        });
        setFormQuestions(updateQuestions);

        // Force update the saved status to false to ensure changes are saved
        setFormSavedStatus(false);

        // Immediately update localStorage with the updated questions
        if (formUID && formUID !== "" && formMode !== "preview") {
            let form = {
                form_uid: formUID,
                title: formTitle,
                description: formDescription,
                begin_date: beginDate,
                end_date: endDate,
                sections: sections,
                questions: updateQuestions,
                mode: formMode,
            };
            localStorage.setItem(formUID, JSON.stringify(form));
            setFormState(form);
        }
    };
    const removeSection = (sectionId) => {
        let newSections = sections.filter(
            (section) => section.section_uid !== sectionId
        );
        setSections(newSections);
        removeSectionFromQuestion(sectionId);

        // Force update the saved status to false to ensure changes are saved
        setFormSavedStatus(false);

        // Immediately update localStorage with the new sections
        /* if (formUID && formUID !== "" && formMode !== "preview") {
            let form = {
                form_uid: formUID,
                title: formTitle,
                description: formDescription,
                begin_date: beginDate,
                end_date: endDate,
                sections: newSections,
                questions: formQuestions,
                mode: formMode,
            };
            localStorage.setItem(formUID, JSON.stringify(form));
            setFormState(form);
        } */
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
                    sectionsWithNoQuestions.push(section.section_uid);
                }
            });
            formQuestions.forEach((q) => {
                if (!questionsInEitherSections.includes(q.question_uid)) {
                    questionsNotInSections.push(q.question_uid);
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
            if (section.section_uid == sectionId) {
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

        let question_uid = moment().valueOf();

        let question = {
            question_uid,
            question: "",
            section_uid: "",
            description: "",
            answer: {
                type: "multiple_choice",
                structure: [],
            },
        };
        // let newQuestions = formQuestions.push(question)
        setFormQuestions([...formQuestions, question]);
    };

    const writeQuestion = (questionId, qn) => {
        // updating or writing new question
        let updatedQuestions = formQuestions.map((q) => {
            if (q.question_uid === questionId) {
                q.question = qn;
            }
            return q;
        });
        setFormQuestions(updatedQuestions);
    };

    const addQuestionChoice = (questionId, type) => {
        let id = moment().valueOf();
        let newQuestions = formQuestions.map((q, i) => {
            if (q.question_uid === questionId) {
                q.answer.structure.push({
                    id,
                    name: type,
                    value: `option${q.answer.structure.length + 1}`,
                    checked: false,
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

        let newQuestions = formQuestions.filter((q) => q.question_uid !== id);

        // removing the question from the section also
        let updateSections = sections.map((section) => {
            section.questions = section.questions.filter((qUId) => qUId !== id);
            return section;
        });
        setSections(updateSections);
        setFormQuestions(newQuestions);
    };

    const changeQuestionType = (qContent) => {
        /* If question type is equal to written, then structure = null  */
        let newQuestions = formQuestions.map((q) => {
            if (q.question_uid === qContent.question_uid) {
                q.answer.type = "yes_no";
            }
            return q;
        });
        setFormQuestions(newQuestions);
    };

    const removeQuestionChoice = (questionId, choiceId) => {
        // removes a question choice in case of multiple choices or check box.
        let updatedQuestions = formQuestions.map((q) => {
            if (q.question_uid === questionId) {
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
            if (q.question_uid === questionId) {
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

        let updatedQuestions = formQuestions.map((q) => {
            if (q.question_uid === questionId) {
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

    // Question reordering functionality
    const reorderQuestions = (newOrder) => {
        // Update the questions array with the new order and section assignments
        setFormQuestions(newOrder);

        // Update sections to reflect the new question assignments
        const updatedSections = sections.map((section) => {
            const sectionQuestions = newOrder.filter(
                (q) => q.section_uid === section.section_uid
            );
            return {
                ...section,
                questions: sectionQuestions,
                questions_uid: sectionQuestions.map((q) => q.question_uid),
            };
        });
        setSections(updatedSections);

        // Force update the saved status to false to ensure changes are saved
        setFormSavedStatus(false);

        // Immediately update localStorage with the new order and sections
        if (formUID && formUID !== "" && formMode !== "preview") {
            let form = {
                form_uid: formUID,
                title: formTitle,
                description: formDescription,
                begin_date: beginDate,
                end_date: endDate,
                sections: updatedSections,
                questions: newOrder,
                mode: formMode,
            };
            localStorage.setItem(formUID, JSON.stringify(form));
            setFormState(form);
        }
    };

    // End dealing with questions

    // compiling data before saving
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
                reorderQuestions,
                getFormQuestions, // should also check if questions are available before saving the form
                getIsInitialized, // check if FormProvider is initialized
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
                // timeline
                _beginDate,
                _endDate,
                _setBeginDate,
                _setEndDate,
                // End form description
                _formState,
                _setFormState,
                //formUID
                getFormUID,
                setFormUIDContext,

                //formSave status
                _formSavedStatus,
                _setFormSavedStatus,
                _hasUnsavedChanges,
                //Form Mode
                getFormMode,
                setFormModeContext,
                // Published Status
                _publishedStatus,
                _setPublishedStatus,
            }}
        >
            {children}
        </FormContext.Provider>
    );
}

export { FormContext, FormProvider };

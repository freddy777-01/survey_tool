export function ValidatorForm(form) {
    if (form === null || !form.title || form.title.trim() === "") {
        return { valid: false, message: "Form title is required." };
    }

    // Enhanced timeline validation
    if (!form.begin_date || !form.end_date) {
        return {
            valid: false,
            message:
                "Start and end dates are required for the survey timeline.",
        };
    }

    const begin = new Date(form.begin_date);
    const end = new Date(form.end_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!(begin instanceof Date) || isNaN(begin.getTime())) {
        return { valid: false, message: "Invalid start date format." };
    }
    if (!(end instanceof Date) || isNaN(end.getTime())) {
        return { valid: false, message: "Invalid end date format." };
    }
    if (end <= begin) {
        return { valid: false, message: "End date must be after start date." };
    }
    if (begin < today) {
        return { valid: false, message: "Start date cannot be in the past." };
    }

    if (!form.questions || form.questions.length === 0) {
        return { valid: false, message: "At least one question is required." };
    }

    // checking if questino is set on a question slote
    for (const question of form.questions) {
        if (!question.question || question.question.trim() === "") {
            return { valid: false, message: "Question content is required." };
        }
        if (
            question.answer.type === "multiple_choice" &&
            (!question.answer.structure || question.answer.structure.length < 2)
        ) {
            return {
                valid: false,
                message:
                    "At least two choices are required for multiple choice questions.",
            };
        }
        if (["multiple_choice", "check_box"].includes(question.answer.type)) {
            if (
                !question.answer.structure ||
                question.answer.structure.length === 0
            ) {
                return {
                    valid: false,
                    message:
                        "Options are required for multiple choice or checkbox questions.",
                };
            }
        }
        if (question.answer.type === "likert_scale") {
            // For simple Likert scale (array format)
            if (Array.isArray(question.answer.structure)) {
                if (
                    !question.answer.structure ||
                    question.answer.structure.length === 0
                ) {
                    return {
                        valid: false,
                        message:
                            "Options are required for Likert scale questions.",
                    };
                }
            }
            // For table Likert scale (object format with statements and options)
            else if (
                typeof question.answer.structure === "object" &&
                question.answer.structure !== null
            ) {
                if (
                    !question.answer.structure.options ||
                    question.answer.structure.options.length === 0
                ) {
                    return {
                        valid: false,
                        message:
                            "Options are required for Likert scale questions.",
                    };
                }
            }
            // If structure is null, undefined, or invalid
            else {
                return {
                    valid: false,
                    message: "Options are required for Likert scale questions.",
                };
            }
        }
        if (
            question.answer.type === "written" &&
            question.answer.structure &&
            question.answer.structure.length > 0
        ) {
            return {
                valid: false,
                message:
                    "Written questions should not have predefined answers.",
            };
        }
    }

    // Section assignment validation
    if (form.sections && form.sections.length > 0) {
        let questionsNotInSections = [];
        let questionsInEitherSections = [];
        let sectionsWithNoQuestions = [];

        // Collect all question IDs that are assigned to sections
        for (const section of form.sections) {
            if (!section.name || section.name.trim() === "") {
                return {
                    valid: false,
                    message: "Section name is required.",
                };
            }

            // Add all question UIDs from either sections
            for (const question_uid of section.questions_uid) {
                questionsInEitherSections.push(question_uid);
            }

            // Check if section has no questions
            if (!section.questions_uid || section.questions_uid.length === 0) {
                sectionsWithNoQuestions.push(section.section_uid);
            }
        }

        // Check which questions are not assigned to any section
        form.questions.forEach((q) => {
            if (questionsInEitherSections.length > 0)
                if (!questionsInEitherSections.includes(q.question_uid))
                    questionsNotInSections.push(q.question_uid);
        });

        // Return validation result
        if (questionsNotInSections.length > 0) {
            return {
                valid: false,
                message: `Please assign ${questionsNotInSections.length} question(s) to available sections.`,
            };
        }

        if (sectionsWithNoQuestions.length > 0) {
            return {
                valid: false,
                message: `Please assign questions to sections or remove empty sections.`,
            };
        }
    }

    return { valid: true };
}
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

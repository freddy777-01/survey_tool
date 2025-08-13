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
            question.choice === "multiple_choice" &&
            (!question.choices || question.choices.length < 2)
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
        if (question.choice === "written" && question.answer) {
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

        /* console.log("=== VALIDATION DEBUG ===");
        console.log("Form sections:", form.sections);
        console.log("Form questions:", form.questions); */

        // Collect all question IDs that are assigned to sections
        form.sections.forEach((section) => {
            if (!section.name || section.name.trim() === "") {
                return {
                    valid: false,
                    message: "Section name is required.",
                };
            }

            /* console.log(
                `Section ${section.name} (${section.section_uid}) has questions:`,
                section.questions
            ); */

            // Add all question IDs from this section
            if (section.questions && Array.isArray(section.questions)) {
                section.questions.forEach((questionId) => {
                    questionsInEitherSections.push(questionId);
                });
            }

            // Check if section has no questions
            if (!section.questions || section.questions.length === 0) {
                sectionsWithNoQuestions.push(section.section_uid);
            }
        });

        /* console.log(
            "Questions assigned to sections:",
            questionsInEitherSections
        ); */

        // Check which questions are not assigned to any section
        form.questions.forEach((question) => {
            const questionId = question.question_uid || question.id;
            /* console.log(
                `Checking question ${questionId} (${question.question})`
            ); */
            if (!questionsInEitherSections.includes(questionId)) {
                questionsNotInSections.push(questionId);
                /* console.log(
                    `Question ${questionId} is NOT assigned to any section`
                ); */
            } else {
                // console.log(`Question ${questionId} IS assigned to a section`);
            }
        });

        /* console.log("Questions not in sections:", questionsNotInSections);
        console.log("=== END VALIDATION DEBUG ==="); */

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

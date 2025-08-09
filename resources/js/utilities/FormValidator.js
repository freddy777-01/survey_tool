export function ValidatorForm(form) {
    if (form === null || !form.title || form.title.trim() === "") {
        return { valid: false, message: "Form title is required." };
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
                        "Choices are required for multiple choice or checkbox questions.",
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

    let questionsNotInSections = [];
    let questionsInEitherSections = [];
    let sectionsWithNoQuestions = [];
    if (form.sections.length > 0) {
        // if sections are available
        form.sections.forEach((section) => {
            // let sectionQuestions = section.questions;
            if (!section.name || section.name.trim() === "") {
                return {
                    valid: false,
                    message: "Section name is required.",
                };
            }
            for (let i = 0; i < section.questions.length; i++) {
                questionsInEitherSections.push(section.questions[i]);
            }
            if (section.questions.length == 0) {
                sectionsWithNoQuestions.push(section.id);
            }
        });
        form.questions.forEach((q) => {
            if (!questionsInEitherSections.includes(q.id)) {
                questionsNotInSections.push(q.id);
            }
        });

        return questionsNotInSections.length > 0 || questionsNotInSections > 0
            ? {
                  valid: false,
                  message:
                      "Please assign questions to available sections or remove unassigned sections",
              }
            : { valid: true };
    }

    // return questionsNotInSections;

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

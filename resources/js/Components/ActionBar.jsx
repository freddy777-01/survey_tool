import { CgAddR } from "react-icons/cg";
import { FormContext } from "@/utilities/FormProvider";
import React, { useContext, useEffect } from "react";
import ShortUniqueId from "short-unique-id";
import { TiEqualsOutline } from "react-icons/ti";
import { IoMdCloudUpload } from "react-icons/io";
import { LuEye } from "react-icons/lu";
import { MdOutlinePublish } from "react-icons/md";
import { Link, router } from "@inertiajs/react";
import Joi from "joi";
import { MdCreateNewFolder } from "react-icons/md";
import { ValidatorForm } from "@/utilities/FormValidator";
import { Button } from "@/Components/ui/button";
import moment from "moment";
import { makeApiRequest } from "@/utilities/api";

// import { ToastContainer, toast } from "react-toastify";

export default function ActionBar({ questionId, toast }) {
    const formContext = useContext(FormContext);
    const uid = new ShortUniqueId({ length: 10 });
    const notify = () => toast("Wow so easy!");

    let formSavedStatus = formContext._formSavedStatus();
    /* useEffect(() => {

    }, [formContext.getFormQuestions()]); */

    const validator = (form) => {
        // formContext.compileForm();
        const latestSections = formContext.getSections();
        const latestQuestions = formContext.getFormQuestions();
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

        /* const schema = Joi.object({
            form_uid: Joi.number().required(),
            title: Joi.string()
                .required()
                .messages({ required: "Form title is required" }),
            description: Joi.string().allow(""),
            sections: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.number(),
                        name: Joi.string().required(),
                        number: Joi.number(),
                        description: Joi.string().allow(""),
                        questions: Joi.array().items(Joi.number()),
                    })
                )
                .optional(),
            questions: Joi.array()
                .items(
                    Joi.object({
                        id: Joi.number(),
                        question: Joi.string().required(),
                        section: Joi.number().optional().allow(""),
                        description: Joi.string().optional().allow(""),
                        answer: Joi.object({
                            type: Joi.string().valid(
                                ...[
                                    "multiple_choice",
                                    "check_box",
                                    "written",
                                    "yes_no",
                                    "likert_scale",
                                ]
                            ),
                            structure: Joi.array()
                                .items(
                                    Joi.object({
                                        id: Joi.number(),
                                        name: Joi.string(),
                                        value: Joi.string(),
                                    })
                                )
                                .optional(),
                        }),
                    })
                )
                .required(),
        }); */
    };
    const submitForm = () => {
        let form;

        // Always get form data from localStorage using form_uid
        const formUID = formContext.getFormUID();
        form = JSON.parse(localStorage.getItem(formUID));

        // If form is null or doesn't have required data, try to get it from context
        if (!form || !form.title) {
            form = {
                form_uid: formContext.getFormUID(),
                title: formContext._formTitle(),
                description: formContext._formDescription(),
                begin_date: formContext._beginDate(),
                end_date: formContext._endDate(),
                sections: formContext.getSections(),
                questions: formContext.getFormQuestions(),
            };
        }

        // Additional timeline validation
        const beginDate = formContext._beginDate();
        const endDate = formContext._endDate();

        if (!beginDate || !endDate) {
            toast.error(
                "Please set both start and end dates for the survey timeline"
            );
            return;
        }

        const begin = moment(beginDate);
        const end = moment(endDate);
        const today = moment().startOf("day");

        if (!begin.isValid() || !end.isValid()) {
            toast.error("Please enter valid dates for the timeline");
            return;
        }

        if (end.isSameOrBefore(begin)) {
            toast.error("End date must be after start date");
            return;
        }

        if (begin.isBefore(today)) {
            toast.error("Start date cannot be in the past");
            return;
        }

        const validation = ValidatorForm(form);
        if (!validation.valid) {
            // console.log("Validation failed for form:", form);
            // console.log("Validation message:", validation.message);
            toast.warning(validation.message);
        } else {
            // console.log("Form is valid, submitting:", form);
            router.post("/save-form", form, {
                preserveState: true,
                onSuccess: (r) => {
                    formContext._setFormSavedStatus(true);

                    toast.success("Survey saved successfully!");
                },
                onError: (e) => {
                    toast.error("Failed to save survey. Please try again.");
                },
            });
        }
    };
    return (
        <div className="flex flex-row justify-center items-center">
            <div className="flex flex-row gap-x-3 items-center">
                <Button
                    variant="default"
                    size="sm"
                    className="p-1 px-3 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    onClick={formContext.addFormQuestion}
                >
                    <CgAddR className="w-4 h-4" />
                    <span>Add Question</span>
                </Button>
                <Button
                    variant="default"
                    size="sm"
                    className="p-1 px-3 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    onClick={() => {
                        formContext.addSection();
                        // console.log(formContext.getSections());
                    }}
                >
                    <TiEqualsOutline className="w-4 h-4" />
                    <span>Add Section</span>
                </Button>
            </div>
            <div className="p-1 px-3 absolute right-[2rem] text-white font-semibold text-lg flex flex-row justify-end items-center gap-x-2">
                <Button
                    variant="default"
                    size="sm"
                    className="p-1 px-3 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    onClick={() => router.get("/survey/create")}
                >
                    <MdCreateNewFolder />
                    <span>Create</span>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className={`p-1 px-3 flex items-center gap-2 ${
                        !formContext._formSavedStatus() ||
                        !formContext._formTitle() ||
                        formContext.getFormQuestions().length === 0
                            ? "border-gray-300 text-gray-400 hover:bg-gray-50 cursor-not-allowed"
                            : "border-blue-500 text-blue-600 hover:bg-blue-50"
                    }`}
                    disabled={
                        !formContext._formSavedStatus() ||
                        !formContext._formTitle() ||
                        formContext.getFormQuestions().length === 0
                    }
                    title={`Saved: ${formContext._formSavedStatus()}, Title: ${!!formContext._formTitle()}, Questions: ${
                        formContext.getFormQuestions().length
                    }`}
                    onClick={(e) => {
                        e.preventDefault();

                        // Check if form can be previewed
                        if (!formContext._formSavedStatus()) {
                            toast.warning(
                                "Please save the form first before previewing"
                            );
                            return;
                        }

                        if (!formContext._formTitle()) {
                            toast.warning(
                                "Please add a title to your survey before previewing"
                            );
                            return;
                        }

                        if (formContext.getFormQuestions().length === 0) {
                            toast.warning(
                                "Please add at least one question before previewing"
                            );
                            return;
                        }

                        const form_uid = formContext.getFormUID();
                        if (!form_uid) {
                            console.error("No form_uid found!");
                            return;
                        }
                        const url = `/preview?form_uid=${form_uid}`;
                        window.open(url, "_blank");
                    }}
                >
                    <LuEye />
                    <span>Preview</span>
                </Button>

                <Button
                    variant="default"
                    size="sm"
                    className="p-1 px-3 bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                    disabled={
                        formContext.getFormMode() !== "edit" &&
                        !formContext._formSavedStatus()
                    }
                    onClick={async () => {
                        if (
                            formContext.getFormMode() !== "edit" &&
                            !formContext._formSavedStatus()
                        ) {
                            toast.warning("Please save the form first");
                            return;
                        }

                        const beginDate = formContext._beginDate();
                        const endDate = formContext._endDate();

                        if (!beginDate || !endDate) {
                            toast.error(
                                "Please set start and end dates before publishing"
                            );
                            return;
                        }

                        // For edit mode, get form data from the context instead of localStorage
                        let form;
                        if (formContext.getFormMode() === "edit") {
                            // Get the published status from the FormProvider
                            form = {
                                form_uid: formContext.getFormUID(),
                                published: formContext._publishedStatus()
                                    ? 1
                                    : 0,
                                begin_date: beginDate,
                                end_date: endDate,
                            };
                        } else {
                            form = JSON.parse(
                                localStorage.getItem(formContext.getFormUID())
                            );
                        }

                        const isRepublish = form.published === 1;

                        if (isRepublish) {
                            const confirmed = confirm(
                                "This will republish the survey. You must change the timeline. Continue?"
                            );
                            if (!confirmed) return;
                        }

                        try {
                            const response = await makeApiRequest(
                                "/api/surveys/publish",
                                {
                                    form_uid: formContext.getFormUID(),
                                    begin_date: beginDate,
                                    end_date: endDate,
                                }
                            );

                            const data = await response.json();

                            if (response.ok) {
                                toast.success(data.message);
                                // Update local form state if not in edit mode
                                if (formContext.getFormMode() !== "edit") {
                                    form.published = 1;
                                    form.status = "active";
                                    form.begin_date = beginDate;
                                    form.end_date = endDate;
                                    localStorage.setItem(
                                        formContext.getFormUID(),
                                        JSON.stringify(form)
                                    );
                                }
                                // Reload the page to reflect the published status
                                window.location.reload();
                            } else {
                                toast.error(
                                    data.error || "Failed to publish survey"
                                );
                            }
                        } catch (error) {
                            toast.error("Failed to publish survey");
                            console.error(error);
                        }
                    }}
                >
                    <MdOutlinePublish />
                    <span>Publish</span>
                </Button>

                <Button
                    variant="default"
                    size="sm"
                    className={`p-1 px-3 flex items-center gap-2 ${
                        formContext._formSavedStatus()
                            ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                    onClick={() => submitForm()}
                    disabled={formContext._formSavedStatus()}
                >
                    <IoMdCloudUpload />
                    <span>
                        {formContext._formSavedStatus() ? "Saved" : "Save"}
                    </span>
                </Button>
            </div>
        </div>
    );
}

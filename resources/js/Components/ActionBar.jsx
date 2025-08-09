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

// import { ToastContainer, toast } from "react-toastify";

//TODO => create a saving button here
/**
 *
 * The preview button should be anabled if there is a saved status on state
 *
 */
export default function ActionBar({ questionId, toast }) {
    const formContext = useContext(FormContext);
    const uid = new ShortUniqueId({ length: 10 });
    const notify = () => toast("Wow so easy!");

    let formSavedStatus = formContext._formSavedStatus();
    /* useEffect(() => {
        console.log(formContext.getFormQuestions());
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

        const schema = Joi.object({
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
        });

        /* const form = {
            title: formContext._formTitle(),
            description: formContext._formDescription(),
            sections: formContext.getSections(),
            questions: formContext.getFormQuestions(),
        }; */

        const { error, value } = schema.validate(form);

        if (error) {
            console.log(error.message);
            return false;
        } else {
            return true;
        }

        // validatorError().catch((e) => console.log(e));
        /*  try {
            } catch (error) {
                toast.error(error + "!");
                console.log(error);
            } */
    };
    const submitForm = () => {
        // console.log(formContext.getSections());
        // console.log(formContext.checkEmptySections());
        // console.log(formContext.getFormUID());
        /* const form = {
            form_uid: moment().valueOf(),
            title: formContext._formTitle(),
            description: formContext._formDescription(),
            sections: formContext.getSections(),
            questions: formContext.getFormQuestions(),
        }; */

        let form = JSON.parse(localStorage.getItem(formContext.getFormUID()));
        const validation = ValidatorForm(form);
        if (!validation.valid) {
            toast.warning(validation.message);
        } else {
            console.log("Form is valid");
        }

        /* if (formContext.getFormQuestions().length === 0) {
            toast.error("Please add at least one question ");
        } else if (formContext.checkEmptySections()) {
            toast.warning(
                "Please assign questions to available sections or remove unassigned sections",
                { className: "w-[20rem]" }
            );
        } else {
            let form = JSON.parse(
                localStorage.getItem(formContext.getFormUID())
            );

            if (validator(form)) {
                router.post("/save-form", form, {
                    preserveState: true,
                    onSuccess: (r) => {
                        formContext._setFormSavedStatus(true);
                        console.log(r);
                        toast.success("Saving successfully!");
                    },
                    onError: (e) => {
                        console.log(e);
                    },
                });
            } else {
                console.log("There are some errors");
            }
        } */
    };
    return (
        <div className="flex flex-row justify-center items-center">
            <div className="flex flex-row gap-x-3 items-center p-4 bg-gray-100 rounded-lg shadow-md">
                <button
                    className="flex flex-row justify-center items-center bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-lg cursor-pointer"
                    title="add question"
                    onClick={formContext.addFormQuestion}
                >
                    <CgAddR className="mx-auto" title="" />
                    <span className=" font-semibold mx-2">Add question</span>
                </button>
                <button
                    className="flex flex-row justify-center items-center bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-lg cursor-pointer"
                    title="add question"
                    onClick={formContext.addSection}
                >
                    <TiEqualsOutline className="mx-auto" title="" />
                    <span className=" font-semibold mx-2">Add Section</span>
                </button>
            </div>
            <div className="absolute right-[2rem] text-white font-semibold text-lg flex flex-row justify-end items-center gap-x-2">
                <a
                    // href={"/preview"}
                    target="_blank"
                    className="flex flex-row gap-x-2 items-center p-2 px-2 rounded-lg bg-blue-400 hover:bg-blue-500 cursor-pointer transition-colors"
                >
                    <MdCreateNewFolder />
                    <span>Create</span>
                </a>
                <button
                    // href={"/preview"}
                    // target="_blank"
                    className={`flex flex-row gap-x-2 items-center p-2 px-2 rounded-lg bg-blue-400 hover:bg-blue-500  transition-colors ${
                        !formContext._formSavedStatus()
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                    }`}
                    onClick={(e) => {
                        /* console.log(
                            JSON.parse(
                                localStorage.getItem(formContext.getFormUID())
                            ).form_uid
                        ); */
                        // window.open("", "_blank");
                        e.preventDefault();
                        router.get(
                            "/preview",
                            {
                                form_uid: JSON.parse(
                                    localStorage.getItem(
                                        formContext.getFormUID()
                                    )
                                ).form_uid,
                            },
                            {
                                preserveState: true,
                            }
                        );
                    }}
                    disabled={!formContext._formSavedStatus() ? true : false}
                >
                    <LuEye />
                    <span>Preview</span>
                </button>

                <button className="flex flex-row gap-x-2 items-center p-2 px-2 rounded-lg bg-blue-400 hover:bg-blue-500 cursor-pointer transition-colors">
                    <MdOutlinePublish />
                    <span>Publish</span>
                </button>

                <button
                    className={`flex flex-row items-center gap-x-2 p-2 px-2 rounded-lg ${
                        formContext._formSavedStatus()
                            ? "bg-blue-400 hover:bg-blue-500 cursor-not-allowed"
                            : "bg-blue-400 hover:bg-blue-500 cursor-pointer"
                    }  transition-colors`}
                    onClick={() => submitForm()}
                    disabled={formContext._formSavedStatus()}
                >
                    <IoMdCloudUpload />
                    <span>Save</span>
                </button>
            </div>
        </div>
    );
}

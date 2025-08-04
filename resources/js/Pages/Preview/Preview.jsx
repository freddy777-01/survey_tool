import React from "react";
import { FormContext, FormProvider } from "@/utilities/FormProvider";
import { ToastContainer } from "react-toastify";
import Layout from "../Layout";

//TODO : Complete preview page
const Preview = () => {
    return (
        <FormProvider>
            <Form />
        </FormProvider>
    );
};

const Form = () => {
    const formContext = React.useContext(FormContext);

    return (
        <div>
            <Layout>
                <div className=" w-[40rem] p-2 rounded-lg shadow-lg bg-gray-100">
                    <p className="text-left text-gray-500 p-2">
                        <span className="text-black font-semibold">
                            Title :
                        </span>{" "}
                        <span>{formContext._formTitle()}</span>
                    </p>
                    <div className="p-2"></div>
                </div>
            </Layout>
        </div>
    );
};
export default Preview;

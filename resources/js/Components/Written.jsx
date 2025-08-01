import React from "react";
import { FormContext } from "@/utilities/FormProvider";

export default function Written({ questionId, choice }) {
    const formContext = React.useContext(FormContext);
    const [answer, setAnswer] = React.useState("");

    React.useEffect(() => {
        formContext.changeAnswerStructure(questionId, choice, []);
    }, [choice]);
    return (
        <div>
            <textarea
                cols={50}
                rows={2}
                placeholder="write here...."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="resize-none focus:outline-none ring-1 ring-blue-300 focus:ring-1 focus:ring-blue-500 rounded-md p-1.5"
                disabled={true}
            ></textarea>
        </div>
    );
}

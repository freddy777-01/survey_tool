import moment from "moment";

export default function Layout(props) {
    return (
        <div className="p-7 pb-0 flex flex-col justify-center items-start border">
            {props.children}
        </div>
    );
}

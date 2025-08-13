import React from "react";
import moment from "moment";

export default function DatePicker({
    placeholder = "",
    name,
    id,
    value,
    defaultValue,
    onChange,
    min,
}) {
    const dateInputRef = React.useRef(null);
    const [displayValue, setDisplayValue] = React.useState(defaultValue ?? "");

    const formatLocalYyyyMmDd = (date) => moment(date).format("YYYY-MM-DD");

    const todayMin = React.useMemo(() => moment().format("YYYY-MM-DD"), []);
    const effectiveMin = min ?? todayMin;

    React.useEffect(() => {
        if (value !== undefined) {
            setDisplayValue(value ?? "");
        }
    }, [value]);

    const openNativePicker = () => {
        const input = dateInputRef.current;
        if (!input) return;
        if (typeof input.showPicker === "function") {
            input.showPicker();
        } else {
            input.click();
        }
    };

    const clearDateValue = () => {
        if (value === undefined) {
            setDisplayValue("");
        }
        if (dateInputRef.current) {
            dateInputRef.current.value = "";
        }
        if (typeof onChange === "function") {
            onChange("");
        }
    };

    const handleDateChange = (event) => {
        const newValue = moment(event.target.value).isValid()
            ? moment(event.target.value).format("YYYY-MM-DD")
            : "";
        if (value === undefined) {
            setDisplayValue(newValue);
        }
        if (typeof onChange === "function") {
            onChange(newValue);
        }
    };

    const validateDate = (dateString) => {
        if (!dateString) return true;
        const date = moment(dateString);
        return date.isValid() && date.isSameOrAfter(moment().startOf('day'));
    };

    return (
        <div className="relative inline-block">
            <input
                type="text"
                name=""
                id={id || ""}
                placeholder={placeholder}
                className={`focus:outline-none ring-1 rounded-md p-2 pr-6 w-[7.2rem] h-[1.5rem] ${
                    displayValue 
                        ? validateDate(displayValue) 
                            ? "ring-green-300 focus:ring-green-500" 
                            : "ring-red-300 focus:ring-red-500"
                        : "ring-blue-300 focus:ring-blue-500"
                }`}
                value={displayValue}
                readOnly
                onClick={openNativePicker}
                onKeyDown={(e) => {
                    if (e.key === "Backspace" || e.key === "Delete") {
                        e.preventDefault();
                        clearDateValue();
                    }
                }}
            />
            {displayValue && (
                <button
                    type="button"
                    aria-label="Clear date"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        clearDateValue();
                    }}
                >
                    ×
                </button>
            )}
            <input
                ref={dateInputRef}
                type="date"
                name={name || ""}
                id={id || ""}
                className="absolute inset-0 w-full h-full opacity-0 pointer-events-none"
                min={effectiveMin}
                value={displayValue}
                onChange={handleDateChange}
            />
        </div>
    );
}

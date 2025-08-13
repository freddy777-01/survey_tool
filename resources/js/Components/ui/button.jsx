import React from "react";

export function Button({ variant = "default", className = "", ...props }) {
    const variants = {
        default:
            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none bg-blue-500 hover:bg-blue-600 text-white",
        outline:
            "inline-flex items-center justify-center whitespace-nowrap rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium",
        ghost: "inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-gray-100",
    };
    return (
        <button className={`${variants[variant]} ${className}`} {...props} />
    );
}

import React from "react";

interface ButtonProps {
    type?: "button" | "submit";
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ type = "button", children }) => (
    <button type={type} className="mt-4 bg-zinc-700 border-black text-white px-4 py-2 rounded w-full">
        {children}
    </button>
);

export default Button;
import { Field } from "formik";

interface InputProps {
    name: string;
    type?: string;
    placeholder?: string;
}

const Input: React.FC<InputProps> = ({ name, type = "text", placeholder }) => (
    <Field
        name={name}
        type={type}
        placeholder={placeholder}
        className="border p-2 w-full rounded"
    />
);

export default Input;
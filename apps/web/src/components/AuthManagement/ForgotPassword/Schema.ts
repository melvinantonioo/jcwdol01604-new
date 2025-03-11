import { object, string } from "yup";

const forgotPasswordSchema = object({
    email: string().email("Email tidak valid").required("Wajib diisi"),
});

export default forgotPasswordSchema;
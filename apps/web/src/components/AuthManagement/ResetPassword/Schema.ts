import { object, string } from "yup";

const resetPasswordSchema = object({
    newPassword: string().min(6, "Minimal 6 karakter").required("Wajib diisi"),
});

export default resetPasswordSchema;
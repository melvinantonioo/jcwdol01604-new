"use client";

import { Formik, Form } from "formik";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/AxiosInstance";
import { useAuthStore } from "@/stores/EmailStore";
import forgotPasswordSchema from "./Schema";
import Input from "@/utils/Inputs/AuthInput";
import Button from "@/utils/Button2";

const ForgotPasswordForm = () => {
    const { setEmail } = useAuthStore();

    const handleForgotPassword = async (values: { email: string }) => {
        try {
            await axiosInstance.post("/auth/forgot-password", values);
            setEmail(values.email);
            Swal.fire("Success!", "Email reset telah dikirim!", "success");
        } catch {
            Swal.fire("Error!", "Email tidak ditemukan.", "error");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-96 bg-white p-6 rounded shadow-md">
                <h1 className="text-lg font-semibold mb-4">Forgot Password</h1>
                <Formik
                    initialValues={{ email: "" }}
                    validationSchema={forgotPasswordSchema}
                    onSubmit={handleForgotPassword}
                >
                    <Form>
                        <Input name="email" placeholder="Masukkan email" />
                        <Button type="submit">Submit</Button>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
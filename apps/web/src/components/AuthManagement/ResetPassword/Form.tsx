"use client";

import { useSearchParams } from "next/navigation";
import { Formik, Form } from "formik";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/AxiosInstance";
import resetPasswordSchema from "./Schema";
import Input from "@/utils/Inputs/AuthInput";
import Button from "@/utils/Button2";

const ResetPassword = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const handleResetPassword = async (values: { newPassword: string }) => {
        try {
            await axiosInstance.post("/auth/reset-password", {
                token,
                newPassword: values.newPassword,
            });
            Swal.fire("Success!", "Password berhasil diubah!", "success").then(
                () => {
                    window.location.href = "/login";
                }
            );
        } catch {
            Swal.fire("Error!", "Token tidak valid atau expired.", "error");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-96 bg-white p-6 rounded shadow-md">
                <h1 className="text-lg font-semibold mb-4">Reset Password</h1>
                <Formik
                    initialValues={{ newPassword: "" }}
                    validationSchema={resetPasswordSchema}
                    onSubmit={handleResetPassword}
                >
                    <Form>
                        <Input name="newPassword" type="password" placeholder="Masukkan password baru" />
                        <Button type="submit">Submit</Button>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default ResetPassword;
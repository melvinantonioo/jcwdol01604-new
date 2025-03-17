"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "@/lib/AxiosInstance";
import Swal from "sweetalert2";
import Modal from "@/components/Modals/Modal";
import Button from "@/utils/Button";

interface ChangeEmailModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChangeEmailModal: React.FC<ChangeEmailModalProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Ganti Email"
            actionLabel="Simpan"
            disabled={loading}
            onSubmit={() => { }}
            body={
                <Formik
                    initialValues={{ newEmail: "" }}
                    validationSchema={Yup.object({
                        newEmail: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
                    })}
                    onSubmit={async (values, { setSubmitting, resetForm }) => {
                        setLoading(true);
                        try {
                            const response = await axiosInstance.post("/profile/update-email", {
                                email: values.newEmail,
                            });

                            Swal.fire("Berhasil", response.data.message, "success");
                            resetForm();
                            onClose();
                        } catch (error: any) {
                            Swal.fire("Error", error.response?.data?.message || "Gagal mengganti email", "error");
                        } finally {
                            setSubmitting(false);
                            setLoading(false);
                        }
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="flex flex-col gap-4">
                            <label className="font-medium">Email Baru</label>
                            <Field type="email" name="newEmail" className="border rounded p-2" />
                            <ErrorMessage name="newEmail" component="div" className="text-red-500 text-sm" />

                            <Button label="Simpan" onClick={() => { }} disabled={isSubmitting} />
                        </Form>
                    )}
                </Formik>
            }
        />
    );
};

export default ChangeEmailModal;

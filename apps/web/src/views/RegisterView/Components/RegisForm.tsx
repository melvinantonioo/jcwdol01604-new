"use client";

import { Formik, Form, FormikProps } from "formik";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/AxiosInstance";
import IRegister from "../types"; 
import Schema from "./Schema";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const router = useRouter();

    const register = async (params: IRegister) => {
        try {
            const { data } = await axiosInstance.post("/auth/regis", params);

            Swal.fire({
                icon: "success",
                title: data.message,
                showConfirmButton: false,
                timer: 2000,
            }).then(() => router.push("/"));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 md:p-8">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">Register</h1>
                <Formik
                    initialValues={{
                        name: "",
                        email: "",
                        password: "",
                        role: "",
                    }}
                    validationSchema={Schema}
                    onSubmit={(values) => {
                        register(values);
                    }}
                >
                    {(props: FormikProps<IRegister>) => {
                        const { values, errors, touched, handleChange } = props;
                        return (
                            <Form>
                                {/* Name Field */}
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        className={`bg-gray-50 border ${touched.name && errors.name ? "border-red-500" : "border-gray-300"
                                            } text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5`}
                                        type="text"
                                        name="name"
                                        onChange={handleChange}
                                        value={values.name}
                                    />
                                    {touched.name && errors.name && (
                                        <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        className={`bg-gray-50 border ${touched.email && errors.email ? "border-red-500" : "border-gray-300"
                                            } text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5`}
                                        type="email"
                                        name="email"
                                        onChange={handleChange}
                                        value={values.email}
                                    />
                                    {touched.email && errors.email && (
                                        <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        className={`bg-gray-50 border ${touched.password && errors.password ? "border-red-500" : "border-gray-300"
                                            } text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5`}
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        value={values.password}
                                    />
                                    {touched.password && errors.password && (
                                        <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                                    )}
                                </div>

                                {/* Role Dropdown */}
                                <div className="mb-4">
                                    <label className="block mb-2 text-sm font-medium text-gray-700">Role</label>
                                    <select
                                        className={`bg-gray-50 border ${touched.role && errors.role ? "border-red-500" : "border-gray-300"
                                            } text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5`}
                                        name="role"
                                        onChange={handleChange}
                                        value={values.role}
                                    >
                                        <option value="" label="Select role" />
                                        <option value="USER" label="User" />
                                        <option value="TENANT" label="Tenant" />
                                    </select>
                                    {touched.role && errors.role && (
                                        <div className="text-red-500 text-sm mt-1">{errors.role}</div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full py-2.5 mt-4 bg-zinc-600 text-white font-bold rounded-lg hover:bg-zinc-700 transition"
                                >
                                    Register
                                </button>
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </div>
    );
}
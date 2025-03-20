"use client";
import { Formik, Form, FormikProps } from "formik";
import Swal from "sweetalert2";
import axiosInstance from "@/lib/AxiosInstance";
import ILogin from "../types";
import Schema from "./Schema";
import ErrorHandler from "@/utils/ErrorHandlers";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import useAuthStore, { IUser } from "@/stores/AuthStores";

import Image from 'next/image';
import Link from "next/link";
import SocialLogin from "@/components/SocialLogin";

const HandleLogin = async (onAuthSuccess: (user: IUser | null) => void) => {
    try {
        const access_token = getCookie("access_token") as string

        if (access_token) {
            const user: IUser = jwtDecode(access_token); //bug
            setCookie("access_token", access_token);
            onAuthSuccess(user);
        }

        return;
    } catch (err) {
        deleteCookie("access_token");
        throw err;
    }
};

export default function LoginForm() {
    const { onAuthSuccess } = useAuthStore();
    const router = useRouter();

    const login = async (params: ILogin) => {
        try {
            const { data } = await axiosInstance.post("/auth/login", params);

            await HandleLogin(onAuthSuccess);

            Swal.fire({
                icon: "success",
                title: data.message,
                showConfirmButton: false,
                timer: 2000,
            }).then(() => router.push("/"));
        } catch (err) {
            ErrorHandler(err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 md:flex-row bg-gray-100">
            <div className="w-full md:w-1/2 p-8 bg-white rounded-lg shadow-lg max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Log in</h1>
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    validationSchema={Schema}
                    onSubmit={(values) => {
                        login(values);
                    }}
                >
                    {(props: FormikProps<ILogin>) => {
                        const { values, errors, touched, handleChange } = props;
                        return (
                            <Form>
                                <div className="mb-4">
                                    <label
                                        htmlFor="email"
                                        className="block mb-2 text-sm font-medium text-gray-700"
                                    >
                                        Email address
                                    </label>
                                    <input
                                        className={`bg-gray-50 border ${touched.email && errors.email ? 'border-red-500' : 'border-gray-300'
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
                                <div className="mb-4">
                                    <label
                                        htmlFor="password"
                                        className="block mb-2 text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </label>
                                    <input
                                        className={`bg-gray-50 border ${touched.password && errors.password ? 'border-red-500' : 'border-gray-300'
                                            } text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5`}
                                        type="password"
                                        name="password"
                                        onChange={handleChange}
                                        value={values.password}
                                    />
                                    {touched.password && errors.password && (
                                        <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                                    )}

                                    {/* Link Forgot Password */}
                                    <div className="text-right mt-2">
                                        <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                </div>
                                <button
                                    className="mt-4 w-full bg-zinc-600 hover:bg-orange-700 text-white font-bold py-2 rounded-lg transition duration-300"
                                    type="submit"
                                >
                                    Log in
                                </button>
                                <div className="flex items-center my-4">
                                    <hr className="flex-grow border-gray-300" />
                                    <span className="px-2 text-gray-500 text-sm">or</span>
                                    <hr className="flex-grow border-gray-300" />
                                </div>
                                <p className="text-center mt-6 text-sm text-gray-600">
                                    <a href="/register" className="text-orange-600 hover:underline">
                                        Sign up
                                    </a>
                                </p>
                            </Form>
                        );
                    }}
                </Formik>

                <div className="flex items-center my-4">
                    <hr className="flex-grow border-gray-300" />
                    <span className="px-2 text-gray-500 text-sm">or</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                <SocialLogin />
            </div>

            <div className="hidden md:block md:w-1/2 relative">
                <Image
                    src="/poster.avif" 
                    alt="Event background"
                    layout="responsive" 
                    objectFit="cover"
                    className="rounded-lg"
                    width={1500}
                    height={1000} 
                />
                <div className="absolute bottom-4 left-4 text-white text-xs bg-black bg-opacity-50 p-2 rounded">
                    <p></p>
                    <p></p>
                    <p></p>
                </div>
            </div>

        </div>
    );
}
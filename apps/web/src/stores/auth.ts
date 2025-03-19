import { create } from "zustand";
import { deleteCookie, setCookie } from "cookies-next";

export interface IUser {
    id: number;
    name: string;
    email: string;
    role?: string;
    profilePicture?: string;
    accessToken?: string;
}

interface IAuthStore {
    user: IUser | null;
    onAuthSuccess: (user: IUser | null, token?: string) => void;
    clearAuth: () => void;
}

const useAuthStore = create<IAuthStore>((set) => ({
    user: null,

    onAuthSuccess: (payload, token) => {
        set(() => ({ user: payload }));
        if (token) {
            setCookie("access_token", token);
        }
    },

    clearAuth: () => {
        set(() => ({ user: null }));
        deleteCookie("access_token");
    },
}));

export default useAuthStore;

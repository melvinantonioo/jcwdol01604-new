import NextAuth from "next-auth";

declare module "next-auth" {
    interface Profile {
        picture?: string; // ✅ Tambahkan properti picture secara eksplisit
    }

    interface Session {
        accessToken?: string;
        user: {
            id: string;
            email: string;
            name: string;
            image?: string;
        };
    }

    interface JWT {
        id?: string;
        accessToken?: string;
        picture?: string;
    }
}

declare module "next-auth" {
    interface Session {
        backendAccessToken?: string;
    }

    interface User extends DefaultUser {
        backendAccessToken?: string;
    }
}
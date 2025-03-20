import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("🔍 Checking sign-in for user:", profile);

            if (!profile?.email) {
                console.error("❌ No email found in profile!");
                return false;
            }

            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/login/google-login`, {
                    email: profile.email,
                    name: profile.name,
                    picture: profile.picture,
                });

                console.log("✅ Backend response:", response.data);

                const data = response.data;
                if (!response.status.toString().startsWith("2")) throw new Error(data.message || "Login failed");

                user.backendAccessToken = data.token;
            } catch (error) {
                console.error("Error during Google sign-in:", error);
                return false;
            }

            return true;
        },

        async jwt({ token, user }) {
            if (user?.backendAccessToken) {
                token.backendAccessToken = user.backendAccessToken;
            }
            return token;
        },

        async session({ session, token }) {
            session.backendAccessToken = token.backendAccessToken as string;
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
};

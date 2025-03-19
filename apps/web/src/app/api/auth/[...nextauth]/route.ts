import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { NextAuthOptions } from "next-auth";
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

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// domains: ["lh3.googleusercontent.com"], 


// import NextAuth from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import { NextAuthOptions } from "next-auth";
// import axios from "axios";

// export const authOptions: NextAuthOptions = {
//     providers: [
//         GoogleProvider({
//             clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
//         }),
//     ],
//     callbacks: {
//         async signIn({ user, profile }) {
//             if (!profile?.email) return false;

//             try {
//                 const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/login/google-login`, {
//                     email: profile.email,
//                     name: profile.name,
//                     picture: profile.picture,
//                 });

//                 if (!response.status.toString().startsWith("2")) return false;

//                 user.backendAccessToken = response.data.token;
//                 user.role = response.data.role;
//                 user.id = response.data.id;
//                 user.profilePicture = response.data.profilePicture;
//             } catch (error) {
//                 console.error("❌ Error during Google sign-in:", error);
//                 return false;
//             }

//             return true;
//         },

//         async jwt({ token, user }) {
//             if (user?.backendAccessToken) {
//                 token.backendAccessToken = user.backendAccessToken;
//                 token.role = user.role;
//                 token.id = user.id;
//                 token.profilePicture = user.profilePicture;
//             }
//             return token;
//         },

//         async session({ session, token }) {
//             session.user = {
//                 id: token.id as number,
//                 name: session.user.name,
//                 email: session.user.email,
//                 role: token.role as string,
//                 profilePicture: token.profilePicture as string,
//             };
//             session.backendAccessToken = token.backendAccessToken as string;
//             return session;
//         },
//     },
//     secret: process.env.NEXTAUTH_SECRET,
//     pages: {
//         signIn: "/login",
//     },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };

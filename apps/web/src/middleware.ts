import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
// import jwtDecode from "jwt-decode";
import { IUser } from "@/stores/AuthStores";

const protectedRoutes = ["/admin", "/dashboard", "/profile"];

export default async function middleware(req: NextRequest) {
    try {

        const isProtected = protectedRoutes.some((path) =>
            req.nextUrl.pathname.startsWith(path)
        );


        const token = req.cookies.get("access_token")?.value || ""; //gunakan ini fixed


        if (isProtected && !token) {
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }

        const user: IUser = jwtDecode(token);
        console.log("Decoded user:", user);

        if (
            isProtected &&
            req.nextUrl.pathname.startsWith("/admin") &&
            user.role.toUpperCase() !== "TENANT"
        ) {
            return NextResponse.redirect(new URL("/update-role", req.nextUrl)); //try 
        }
        console.log("Middleware berjalan untuk:", req.nextUrl.pathname);

        return NextResponse.next();
    } catch (err) {
        console.error("Middleware error:", err);
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }
}

export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*", "/profile/:path*"],
};
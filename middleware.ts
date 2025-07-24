import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

const authPages = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("soultouch_session_token")?.value;
  const { pathname, searchParams } = request.nextUrl;

  const isAuthPage = authPages.includes(pathname);
  const isProtectedRoute = pathname.startsWith("/");

  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (token) {
    const payload = await verifyToken(token);

    if (payload && (payload.role === "Admin" || payload.role === "Staff")) {
      if (isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      // Restrict STAFF to only /attendance, /, /profile
      if (payload.role === "Staff") {
        const allowedStaffRoutes = ["/attendance", "/", "/profile"];
        // Allow /attendance/history and /attendance/record as well
        const allowedAttendanceSubRoutes = [
          "/attendance/history",
          "/attendance/record",
        ];
        if (
          !allowedStaffRoutes.includes(pathname) &&
          !allowedAttendanceSubRoutes.includes(pathname)
        ) {
          // Redirect staff to /attendance if they try to access any other route
          return NextResponse.redirect(new URL("/attendance", request.url));
        }
      }
      return NextResponse.next();
    } else {
      const response = NextResponse.next();
      response.cookies.delete("soultouch_session_token");
      return response;
    }
  } else {
    if (isProtectedRoute && !isAuthPage) {
      const url = new URL("/login", request.url);
      const callbackUrl = `${pathname}?${searchParams.toString()}`;
      url.searchParams.set("callbackUrl", callbackUrl);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

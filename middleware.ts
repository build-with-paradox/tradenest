import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define allowed roles
const ALLOWED_ROLES = ["buyer"];

export const middleware = async (request: NextRequest) => {
  try {
    const sessionToken = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (sessionToken) {
      const userRole = sessionToken.role;

      if (userRole && ALLOWED_ROLES.includes(userRole)) {
        return NextResponse.next(); 
      } else {
        return redirectToUnauthorized(request); 
      }
    }

    return redirectToSignIn(request);

  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

const redirectToSignIn = (request: NextRequest) => {
  return NextResponse.redirect(new URL("/authentication/signin", request.url));
};

const redirectToUnauthorized = (request: NextRequest) => {
  return NextResponse.redirect(new URL("/", request.url));
};

export const config = {
  matcher: [
    // Pages that require signin
    "/account",
    "/shop",
    "/profile",
    "/wishlist",
    "/cart",
    "/order-history",

    // apis that require signin
    "/api/profile"
  ],
};

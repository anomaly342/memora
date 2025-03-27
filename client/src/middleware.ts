import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

const { NEXT_PUBLIC_SERVER_URL } = process.env;

const checkAuthentication = async (jwt_token: string) => {
	try {
		const response = await fetch(
			`${NEXT_PUBLIC_SERVER_URL}/authentication/check`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},

				body: JSON.stringify({ jwt_token }),
			}
		);

		return response.ok;
	} catch (error) {
		console.error("Auth check failed:", error);
		return false;
	}
};

export async function middleware(request: NextRequest) {
	const jwt_token = request.cookies.get("jwt-token")?.value;
	const url = request.nextUrl.clone();
	const isLoginPage = url.pathname === "/login" || url.pathname === "/register";
	if (!jwt_token) {
		if (isLoginPage) {
			return NextResponse.next(); // Allow access to login page if no token
		}
		url.pathname = "/login";
		return NextResponse.redirect(url);
	}
	// If user is on /login and has a token, redirect immediately without rechecking authentication
	if (isLoginPage) {
		url.pathname = "/";
		return NextResponse.redirect(url);
	}
	// Check authentication only if not coming from /login
	const isAuthenticated = await checkAuthentication(jwt_token);
	if (!isAuthenticated) {
		url.pathname = "/login";
		const response = NextResponse.redirect(url);
		response.cookies.delete("jwt-token");
		return response;
	}
	return NextResponse.next();
}

export const config = {
	matcher: [
		"/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
	],
};

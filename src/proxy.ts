import { type NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN_COOKIE = "flow_access_token";

const LOGIN_PATH = "/login";
const DEFAULT_AUTHENTICATED_PATH = "/merchants";

/** Routes that must never render for an anonymous visitor. */
const PROTECTED_PREFIXES = [
  "/merchants",
  "/transactions",
  "/settlements",
  "/finance",
  "/team",
  "/risk-flag",
  "/dashboard",
];

/** Routes an already-signed-in user should be bounced away from. */
const AUTH_PREFIXES = ["/login", "/otp"];

function matchesPrefix(pathname: string, prefixes: string[]): boolean {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSession = Boolean(request.cookies.get(ACCESS_TOKEN_COOKIE)?.value);

  if (!hasSession && matchesPrefix(pathname, PROTECTED_PREFIXES)) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    // Remember where they were headed so sign-in can return tphem there.
    loginUrl.searchParams.set("from", `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  if (hasSession && matchesPrefix(pathname, AUTH_PREFIXES)) {
    return NextResponse.redirect(
      new URL(DEFAULT_AUTHENTICATED_PATH, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  // Skip Next internals, the API proxy and anything with a file extension.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*..*).*)"],
};

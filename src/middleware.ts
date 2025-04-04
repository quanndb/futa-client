import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const languages = ["en", "vi"];
export const defaultLanguage = "en";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const pathnameHasLanguage = languages.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  if (pathnameHasLanguage) return NextResponse.next();

  const acceptLanguage = request.headers.get("Accept-Language") || "";
  let language = defaultLanguage;

  for (const lang of languages) {
    if (acceptLanguage.includes(lang)) {
      language = lang;
      break;
    }
  }

  return NextResponse.redirect(
    new URL(`/${language}${pathname === "/" ? "" : pathname}`, request.url)
  );
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

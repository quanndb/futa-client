import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Ngôn ngữ được hỗ trợ
export const languages = ["en", "vi"];
export const defaultLanguage = "en";

export function middleware(request: NextRequest) {
  // Lấy đường dẫn yêu cầu
  const pathname = request.nextUrl.pathname;

  // Bỏ qua nếu request là cho static files hoặc API
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Kiểm tra xem URL đã có mã ngôn ngữ chưa
  const pathnameHasLanguage = languages.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  if (pathnameHasLanguage) return NextResponse.next();

  // Lấy ngôn ngữ từ header Accept-Language hoặc dùng mặc định
  const acceptLanguage = request.headers.get("Accept-Language") || "";
  let language = defaultLanguage;

  // Tìm ngôn ngữ đầu tiên khớp từ Accept-Language
  for (const lang of languages) {
    if (acceptLanguage.includes(lang)) {
      language = lang;
      break;
    }
  }

  // Redirect đến URL có mã ngôn ngữ
  return NextResponse.redirect(
    new URL(`/${language}${pathname === "/" ? "" : pathname}`, request.url)
  );
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

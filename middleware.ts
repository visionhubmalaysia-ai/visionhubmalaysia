import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { routing } from "@/lib/i18n/routing";

const intl = createIntlMiddleware(routing);
const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY;

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/(en|ms)/admin(.*)"]);

function adminNotConfigured(req: NextRequest) {
  return new NextResponse(
    `<!doctype html><meta charset=utf-8><title>Admin not configured</title>
<body style="font:15px/1.5 system-ui;padding:4rem;max-width:48rem;margin:auto;color:#111">
<h1 style="font-size:1.75rem">Admin sign-in is not configured yet</h1>
<p>Clerk keys are missing. Install the Clerk integration from the Vercel Marketplace
(or set <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code>CLERK_SECRET_KEY</code>)
and redeploy.</p>
<p><a href="/">← Back to homepage</a></p>`,
    { status: 503, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

const withClerk = clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) {
    const { userId, sessionClaims, redirectToSignIn } = await auth();
    if (!userId) return redirectToSignIn({ returnBackUrl: req.url });
    const role =
      (sessionClaims?.metadata as { role?: string } | undefined)?.role ??
      (sessionClaims?.publicMetadata as { role?: string } | undefined)?.role ??
      sessionClaims?.org_role;
    if (role !== "admin") return new NextResponse("Forbidden", { status: 403 });
  }
  return intl(req);
});

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (!hasClerk) {
    if (isAdminRoute(req)) return adminNotConfigured(req);
    return intl(req);
  }
  return withClerk(req, event);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};

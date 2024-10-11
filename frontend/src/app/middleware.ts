// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../lib/supabaseClient";

export async function middleware(req: NextRequest) {
  // Extract the auth token from cookies
  const token = req.cookies.get("supabase-auth-token")?.value;

  if (!token) {
    // If no token, redirect to login page
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Verify the token with Supabase
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If authenticated, continue
  return NextResponse.next();
}

// Specify which paths should run the middleware
export const config = {
  matcher: ["/home", "/profile", "/post/:id*", "/profile/:id"],
};

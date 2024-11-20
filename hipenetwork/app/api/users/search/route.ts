import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabaseClient";

export async function GET(req: Request) {
  const { search, userId } = Object.fromEntries(new URL(req.url).searchParams);

  if (!search) {
    return NextResponse.json(
      { error: "No search term provided" },
      { status: 400 },
    );
  }

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, email, first_name, last_name")
    .neq("id", userId) // Exclude current user using the provided userId
    .ilike("email", `%${search}%`)
    .limit(5);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

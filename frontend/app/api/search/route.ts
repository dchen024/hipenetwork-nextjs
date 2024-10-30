// app/api/search/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/supabaseClient";

export async function GET(req: Request) {
  const { search } = Object.fromEntries(new URL(req.url).searchParams);

  if (!search) {
    return NextResponse.json(
      { error: "No search term provided" },
      { status: 400 },
    );
  }

  // Perform a full-text search on the 'posts' table using the 'title' column
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .textSearch("title", search, {
      type: "websearch",
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

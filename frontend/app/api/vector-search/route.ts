import { NextResponse } from "next/server";
import vectorSearchOpenAI from "@/utils/mongodb/vectorSearch";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Query is required" },
        { status: 400 },
      );
    }

    const results = await vectorSearchOpenAI(query);

    return NextResponse.json({
      success: true,
      query,
      results,
    });
  } catch (error) {
    console.error("Search failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Search failed",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

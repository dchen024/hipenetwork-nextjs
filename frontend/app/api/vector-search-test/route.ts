import { NextResponse } from "next/server";
import vectorSearchMongoDB from "@/utils/mongodb/vectorSearch";

export async function GET() {
  try {
    const searchQuery = "Where the library at CCNY?";
    console.log("Starting vector search for:", searchQuery);

    const results = await vectorSearchMongoDB(searchQuery);

    return NextResponse.json({
      success: true,
      query: searchQuery,
      results: results,
    });
  } catch (error) {
    console.error("Vector search failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to perform vector search",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

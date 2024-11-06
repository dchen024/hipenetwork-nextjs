import { NextResponse } from "next/server";
import createEmbeddings from "@/utils/openai/generateEmbeddings";

export async function POST(request: Request) {
  try {
    // Test text
    const testText = "Hello, this is a test for embeddings generation.";

    const embedding = await createEmbeddings(testText);

    return NextResponse.json({
      success: true,
      embedding: embedding,
    });
  } catch (error) {
    console.error("Embedding generation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate embeddings" },
      { status: 500 },
    );
  }
}

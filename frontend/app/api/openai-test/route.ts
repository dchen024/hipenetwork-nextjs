import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(request: Request) {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const messages = [
      {
        role: "user",
        content: "Hello, how are you?",
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages as OpenAI.Chat.ChatCompletionMessageParam[],
    });

    return NextResponse.json({
      success: true,
      response: completion.choices[0].message,
    });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process OpenAI request" },
      { status: 500 },
    );
  }
}

// curl -X POST http://localhost:3000/api/openai-test

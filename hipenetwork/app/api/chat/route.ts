import { NextResponse } from "next/server";
import OpenAI from "openai";
import vectorSearchMongoDB from "@/utils/mongodb/vectorSearch";

export async function POST(request: Request) {
  try {
    const { messages, school } = await request.json();
    const currentMessageContent = messages[messages.length - 1].content;
    const previousMessages = messages.slice(0, -1);

    // Initialize the OpenAI chat model
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Perform the RAG search
    const ragResults = await vectorSearchMongoDB(currentMessageContent);

    // Ensure ragResults is an array of strings
    const ragMessages = Array.isArray(ragResults) ? ragResults : [ragResults];

    const formattedRagMessages = ragMessages.map((result) =>
      typeof result === "string" ? result : JSON.stringify(result),
    );

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful ${school} guide who loves to assist students! If you are unsure say "I'm sorry, I don't have that specific information."`,
        },
        ...previousMessages,
        ...formattedRagMessages.map((result) => ({
          role: "assistant",
          content: result,
        })),
        {
          role: "user",
          content: currentMessageContent,
        },
      ],
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { error: "An error occurred during chat processing" },
      { status: 500 },
    );
  }
}

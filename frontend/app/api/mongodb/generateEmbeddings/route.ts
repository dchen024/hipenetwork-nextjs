import { NextResponse } from "next/server";
import createEmbeddings from "@/utils/openai/generateEmbeddings";
import { connectToMongoDB } from "@/utils/mongodb/mongodb";
import fs from "fs";
import path from "path";

interface SchoolData {
  question: string;
  answer: string;
  tags: string[];
  context: string;
  school: string;
}

export async function POST() {
  try {
    const filePath = path.resolve("./data/ccny.json");
    const dataArray: SchoolData[] = JSON.parse(
      fs.readFileSync(filePath, "utf-8"),
    );

    const client = await connectToMongoDB();
    const database = client.db("db");
    const collection = database.collection("ccny_embeddings");

    let updatedCount = 0;
    let insertedCount = 0;

    for (const item of dataArray) {
      // First check if document exists
      const existingDoc = await collection.findOne({
        question: item.question,
        school: item.school,
      });

      // Create embedding for the document
      const inputString = `question: ${item.question}\n answer: ${item.answer}\n context: ${item.context}\n tags: ${item.tags.join(", ")}`;
      const data = await createEmbeddings(inputString);
      const embedding = data.data[0].embedding;

      const documentWithEmbedding = {
        ...item,
        plot_embedding: embedding,
        lastUpdated: new Date(), // Add timestamp for tracking updates
      };

      // Upsert operation with compound key (question + school)
      const result = await collection.updateOne(
        {
          question: item.question,
          school: item.school,
        },
        {
          $set: documentWithEmbedding,
          $setOnInsert: {
            createdAt: new Date(), // Only set on new documents
          },
        },
        { upsert: true },
      );

      if (result.upsertedCount > 0) {
        insertedCount++;
        console.log(`Inserted new document: ${item.question}`);
      }
      if (result.modifiedCount > 0) {
        updatedCount++;
        console.log(`Updated existing document: ${item.question}`);
      }
    }

    await client.close();

    return NextResponse.json({
      success: true,
      message: `Operation completed: ${insertedCount} documents inserted, ${updatedCount} documents updated`,
      details: {
        insertedCount,
        updatedCount,
        totalProcessed: dataArray.length,
      },
    });
  } catch (error) {
    console.error("Error processing documents:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process documents",
        details: error.message,
      },
      { status: 500 },
    );
  }
}

// curl -X POST http://localhost:3000/api/mongodb/generateEmbeddings

import { MongoClient } from "mongodb";
import createEmbeddings from "@/utils/openai/generateEmbeddings";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not defined");
}

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function vectorSearchMongoDB(question: string) {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("db");
    const collection = database.collection("ccny_embeddings");

    // Generate embedding for the search query
    const embeddingResponse = await createEmbeddings(question);
    const queryVector = embeddingResponse.data[0].embedding;

    // Vector search pipeline with properly configured filter
    const pipeline = [
      {
        $vectorSearch: {
          queryVector: queryVector,
          path: "plot_embedding",
          numCandidates: 100,
          limit: 3,
          index: "vector_index", // Make sure this matches your index name
          filter: {
            school: "CCNY",
          },
        },
      },
      {
        $project: {
          _id: 1,
          question: 1,
          answer: 1,
          context: 1,
          tags: 1,
          school: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ];

    const results = await collection.aggregate(pipeline).toArray();
    console.log(`Found ${results.length} matches for CCNY`);

    return results;
  } catch (error) {
    console.error("Vector search error:", error);
    throw error;
  } finally {
    await client.close();
  }
}

export default vectorSearchMongoDB;

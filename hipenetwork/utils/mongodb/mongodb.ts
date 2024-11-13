import { MongoClient } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI environment variable is not defined");
}

const uri = process.env.MONGO_URI;

export async function connectToMongoDB() {
  const client = new MongoClient(uri, {
    tls: true, // Use tls instead of ssl
    tlsAllowInvalidCertificates: true,
  });

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    return client;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export default connectToMongoDB;

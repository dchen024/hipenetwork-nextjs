import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_KEY environment variable is not defined");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function createEmbeddings(text: string) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });

  return embedding;
}

export default createEmbeddings;

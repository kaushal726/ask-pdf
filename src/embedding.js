require("dotenv").config();
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use your OpenAI API key
});

// Function to create embedding for a given text (chunk or query)
async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: "text-embedding-ada-002",
    input: text,
  });
  return response.data[0].embedding;
}

// Function to process and embed all text chunks
async function processAndEmbedChunks(chunks) {
  const chunkEmbeddings = [];

  for (const chunk of chunks) {
    const embedding = await getEmbedding(chunk);
    chunkEmbeddings.push({ chunk, embedding });
  }

  return chunkEmbeddings;
}

module.exports = { getEmbedding, processAndEmbedChunks };

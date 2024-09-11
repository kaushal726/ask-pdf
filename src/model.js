require("dotenv").config();
const { OpenAI } = require("openai");
const appConfig = require("./data/config.json");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function askOpenAI(prompt) {
  console.log(prompt);

  try {
    const { MAX_TOKEN, MODEL, TEMPERATURE } = appConfig;
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: MAX_TOKEN,
      temperature: TEMPERATURE,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.warn("Rate limit exceeded. Retrying...");
      await sleep(60000);
      return askOpenAI(prompt);
    } else {
      console.error("Error interacting with OpenAI API: ", error);
      throw error;
    }
  }
}

// async function getEmbedding(text) {
//   const response = await openai.embeddings.create({
//     model: "text-embedding-ada-002",
//     input: text,
//   });
//   return response.data[0].embedding; // This will return the embedding vector
// }

// // Store the chunks with their embeddings
// async function processAndEmbedChunks(chunks) {
//   const chunkEmbeddings = [];

//   for (const chunk of chunks) {
//     const embedding = await getEmbedding(chunk);
//     chunkEmbeddings.push({ chunk, embedding });
//   }

//   return chunkEmbeddings;
// }

module.exports = { askOpenAI };

const { extractPdfText, chunkText } = require("./text.extractor");
const { getEmbedding, processAndEmbedChunks } = require("./embedding");
const { findRelevantChunks } = require("./similarity");

async function chatWithRelevantText(pdfPath, prompt) {
  try {
    // Step 1: Extract text from PDF
    const extractedText = await extractPdfText(pdfPath);

    // Step 2: Chunk the text
    const chunks = chunkText(extractedText);
    // console.log(chunks);

    // Step 3: Embed the text chunks
    const chunkEmbeddings = await processAndEmbedChunks(chunks);

    // Step 4: Embed the query (prompt)
    const queryEmbedding = await getEmbedding(prompt);

    // Step 5: Find the relevant chunks based on similarity
    const relevantChunks = await findRelevantChunks(
      queryEmbedding,
      chunkEmbeddings
    );
    console.log(relevantChunks);

    // Step 6: Combine relevant chunks and send to ChatGPT
    const combinedText = relevantChunks.join(" ");
    const finalPrompt = prompt + "\n\n" + combinedText;

    const response = await askOpenAI(finalPrompt); // Your OpenAI API call
    console.log("ChatGPT Response:", response);
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = { chatWithRelevantText };

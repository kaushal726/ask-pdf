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

const { extractPdfText, chunkText } = require("./text.extractor");
const { getEmbedding, processAndEmbedChunks } = require("./embedding");
const { findRelevantChunks } = require("./similarity");

async function chatWithRelevantText(pdfPath, prompt) {
  try {
    const extractedText = await extractPdfText(pdfPath);

    const chunks = chunkText(extractedText);

    const chunkEmbeddings = await processAndEmbedChunks(chunks);

    const queryEmbedding = await getEmbedding(prompt);

    const relevantChunks = await findRelevantChunks(
      queryEmbedding,
      chunkEmbeddings
    );

    const combinedText = relevantChunks.join(" ");
    const finalPrompt = prompt + "\n\n" + combinedText;

    const response = await askOpenAI(finalPrompt);

    console.log("ChatGPT Response:", response);
  } catch (error) {
    console.error("Error:", error);
  }
}

module.exports = { chatWithRelevantText, askOpenAI };

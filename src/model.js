require("dotenv").config();
const { OpenAI } = require("openai");
const appConfig = require("./data/config.json");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function askOpenAI(prompt) {
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

module.exports = { askOpenAI };

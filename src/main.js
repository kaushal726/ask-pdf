// const { chatWithPdf } = require("./ask.pdf");

// const pdfPath = "./data/sample.pdf";
// chatWithPdf(pdfPath);

const { chatWithRelevantText } = require("./model");

const pdfPath = "./data/sample.pdf";
const prompt = "Elephant Name";

chatWithRelevantText(pdfPath, prompt);

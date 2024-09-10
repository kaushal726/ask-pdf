const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();

const options = {};

async function extractPdfText(pdfPath) {
  return new Promise((resolve, reject) => {
    pdfExtract.extract(pdfPath, options, (err, data) => {
      if (err) {
        return reject(err);
      }

      let extractedText = "";
      data.pages.forEach((page) => {
        page.content.forEach((item) => {
          extractedText += item.str + " ";
        });
      });

      resolve(extractedText.trim());
    });
  });
}

module.exports = { extractPdfText };

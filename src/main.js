import { chatWithRelevantText } from './model';

const pdfPath = './data/sample.pdf';
const prompt = 'Elephant Name';

chatWithRelevantText(pdfPath, prompt);

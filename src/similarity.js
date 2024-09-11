function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

// Function to find relevant chunks based on similarity
// async function findRelevantChunks(queryEmbedding, chunkEmbeddings) {
//   const relevantChunks = [];

//   for (const { chunk, embedding } of chunkEmbeddings) {
//     const similarity = cosineSimilarity(queryEmbedding, embedding);

//     if (similarity > 6) {
//       // Adjust threshold if needed
//       relevantChunks.push(chunk);
//     }
//   }

//   return relevantChunks;
// }

async function findRelevantChunks(queryEmbedding, chunkEmbeddings) {
  const relevantChunks = [];

  for (const { chunk, embedding } of chunkEmbeddings) {
    const similarity = cosineSimilarity(queryEmbedding, embedding);

    console.log(`Similarity between query and chunk: ${similarity}`); // Print similarity value

    // Check if similarity is above threshold
    if (similarity > 0.5) {
      // Lowered the threshold to 0.5 for testing
      console.log(`Relevant chunk found with similarity ${similarity}:`, chunk); // Print relevant chunk
      relevantChunks.push(chunk);
    }
  }

  return relevantChunks;
}

module.exports = { cosineSimilarity, findRelevantChunks };

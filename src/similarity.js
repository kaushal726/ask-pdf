function cosineSimilarity(vecA, vecB) {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}

async function findRelevantChunks(queryEmbedding, chunkEmbeddings) {
  const relevantChunks = [];

  for (const { chunk, embedding } of chunkEmbeddings) {
    const similarity = cosineSimilarity(queryEmbedding, embedding);

    if (similarity > 0.5) {
      relevantChunks.push(chunk);
    }
  }

  return relevantChunks;
}

module.exports = { cosineSimilarity, findRelevantChunks };

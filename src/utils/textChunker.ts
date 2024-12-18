export function chunkText(text: string, maxLength: number = 4000): string[] {
  const chunks: string[] = [];
  let currentChunk = '';
  
  // Split by sentences to maintain coherence
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  for (const sentence of sentences) {
    // If adding this sentence would exceed the limit
    if ((currentChunk + sentence).length > maxLength) {
      // If the current chunk is not empty, push it
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      
      // If the sentence itself is longer than maxLength, split it
      if (sentence.length > maxLength) {
        // Split by words
        const words = sentence.split(/\s+/);
        let tempChunk = '';
        
        for (const word of words) {
          if ((tempChunk + ' ' + word).length > maxLength) {
            chunks.push(tempChunk.trim());
            tempChunk = word;
          } else {
            tempChunk += (tempChunk ? ' ' : '') + word;
          }
        }
        
        if (tempChunk) {
          currentChunk = tempChunk;
        }
      } else {
        currentChunk = sentence;
      }
    } else {
      currentChunk += (currentChunk ? ' ' : '') + sentence;
    }
  }
  
  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}
const WORDS_PER_MINUTE = 225;

export function countWords(text: string) {
  return text
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

export function estimateReadingTime(text: string, wordsPerMinute = WORDS_PER_MINUTE) {
  const wordCount = countWords(text);
  return {
    wordCount,
    readingTime: Math.max(1, Math.ceil(wordCount / wordsPerMinute)),
  };
}

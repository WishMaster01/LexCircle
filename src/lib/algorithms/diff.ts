export function diffWords(previous: string, next: string) {
  const prevWords = previous.split(/\s+/);
  const nextWords = next.split(/\s+/);
  const added = nextWords.filter((word) => !prevWords.includes(word));
  const removed = prevWords.filter((word) => !nextWords.includes(word));

  return {
    added,
    removed,
  };
}

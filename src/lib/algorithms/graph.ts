export function jaccardSimilarity<T>(left: Set<T>, right: Set<T>) {
  const intersection = [...left].filter((item) => right.has(item)).length;
  const union = new Set([...left, ...right]).size;
  return union === 0 ? 0 : intersection / union;
}

export function mutualFollowers(base: Set<string>, candidate: Set<string>) {
  return [...base].filter((item) => candidate.has(item)).length;
}

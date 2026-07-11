import { demoArticles, demoCategories, demoTags } from "@/constants/demo-data";
import { Trie } from "@/lib/algorithms/trie";

const trie = new Trie();
for (const value of [
  ...demoArticles.map((article) => article.title),
  ...demoCategories.map((category) => category.name),
  ...demoTags.map((tag) => tag.name),
]) {
  trie.insert(value);
}

export function getSearchSuggestions(prefix: string) {
  if (!prefix.trim()) return [];
  return trie.suggest(prefix, 6);
}

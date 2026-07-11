type TrieNode = {
  children: Map<string, TrieNode>;
  isWord: boolean;
};

export class Trie {
  private root: TrieNode = { children: new Map(), isWord: false };

  insert(word: string) {
    let node = this.root;
    for (const char of word.toLowerCase()) {
      if (!node.children.has(char)) {
        node.children.set(char, { children: new Map(), isWord: false });
      }
      node = node.children.get(char)!;
    }
    node.isWord = true;
  }

  suggest(prefix: string, limit = 8) {
    let node = this.root;
    const normalized = prefix.toLowerCase();

    for (const char of normalized) {
      const next = node.children.get(char);
      if (!next) return [];
      node = next;
    }

    const suggestions: string[] = [];
    const queue: Array<{ node: TrieNode; value: string }> = [{ node, value: normalized }];

    while (queue.length && suggestions.length < limit) {
      const current = queue.shift()!;
      if (current.node.isWord) {
        suggestions.push(current.value);
      }

      for (const [char, child] of current.node.children.entries()) {
        queue.push({ node: child, value: `${current.value}${char}` });
      }
    }

    return suggestions;
  }
}

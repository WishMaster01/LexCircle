# Algorithms and Data Structures

| Feature | Algorithm / DS | Reason | Time | Space | Notes |
| --- | --- | --- | --- | --- | --- |
| Draft autosave | Debounce | Prevent per-keystroke writes | O(1) | O(1) | `src/lib/algorithms/debounce.ts` |
| Suggestions | Trie | Fast prefix lookup for demo suggestions | O(P + K) lookup | O(N) | Replace with DB/Redis at scale |
| Trending | Weighted ranking | Explainable feed ranking | O(1) score | O(1) | Includes recency decay |
| Related articles | Jaccard similarity | Shared-tag relevance | O(|A| + |B|) | O(|A| + |B|) | Adds author/category bonuses |
| Nested comments | Map-based tree build | Efficient adjacency expansion | O(N) | O(N) | `buildCommentTree` |
| Pagination | Cursor helpers | Stable pagination structure | O(1) | O(1) | Base64 cursor encoding |
| Slugs | Collision resolution | Deterministic SEO slugs | O(K) | O(1) | Numeric suffixes |
| Rate limiting | Sliding window | Local anti-abuse primitive | O(1) | O(U) | Replace with Redis in production |
| Caching | LRU cache | Reusable local cache primitive | O(1) | O(C) | Long-running runtimes only |
| Follow graph | Jaccard / mutual sets | Similar-author heuristics | O(N) | O(N) | Good for bounded candidate sets |
| Revision summaries | Diff helper | Change summaries at checkpoints | O(N) | O(N) | Keep off the keystroke path |
| State machine | Transition map | Explicit lifecycle validation | O(1) | O(1) | Guards article transitions |

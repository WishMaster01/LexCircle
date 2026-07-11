export class LruCache<K, V> {
  private store = new Map<K, V>();

  constructor(private readonly capacity: number) {}

  get(key: K) {
    if (!this.store.has(key)) return undefined;
    const value = this.store.get(key)!;
    this.store.delete(key);
    this.store.set(key, value);
    return value;
  }

  set(key: K, value: V) {
    if (this.store.has(key)) {
      this.store.delete(key);
    } else if (this.store.size >= this.capacity) {
      const oldestKey = this.store.keys().next().value as K;
      this.store.delete(oldestKey);
    }
    this.store.set(key, value);
  }
}

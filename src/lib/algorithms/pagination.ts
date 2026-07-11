export type CursorPage<T> = {
  items: T[];
  nextCursor: string | null;
};

export function encodeCursor(values: { createdAt: string; id: string }) {
  return Buffer.from(JSON.stringify(values)).toString("base64url");
}

export function decodeCursor(cursor: string) {
  return JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as {
    createdAt: string;
    id: string;
  };
}

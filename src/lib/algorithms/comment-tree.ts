export type CommentNode = {
  id: string;
  parentId?: string | null;
  content: string;
  replies: CommentNode[];
};

export function buildCommentTree(comments: Array<Omit<CommentNode, "replies">>) {
  const map = new Map<string, CommentNode>();
  const roots: CommentNode[] = [];

  for (const comment of comments) {
    map.set(comment.id, { ...comment, replies: [] });
  }

  for (const comment of map.values()) {
    if (comment.parentId) {
      const parent = map.get(comment.parentId);
      if (parent) {
        parent.replies.push(comment);
        continue;
      }
    }
    roots.push(comment);
  }

  return roots;
}

type CommentItem = {
  id: string;
  author: string;
  content: string;
  replies?: CommentItem[];
};

export function CommentThread({ comments }: { comments: CommentItem[] }) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="rounded-2xl border border-border/80 bg-card/80 p-4">
          <p className="text-sm font-medium">{comment.author}</p>
          <p className="mt-2 text-sm text-muted">{comment.content}</p>
          {comment.replies?.length ? (
            <div className="mt-4 space-y-3 border-l border-border pl-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="rounded-xl bg-background/70 p-3">
                  <p className="text-sm font-medium">{reply.author}</p>
                  <p className="mt-1 text-sm text-muted">{reply.content}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

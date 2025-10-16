import { useState } from "react";

const DEFAULT_COMMENTS = [
  { id: 1, user: "Alice", text: "This is a great post!" },
  { id: 2, user: "Bob", text: "I totally agree with Alice." },
];

export default function CommentSection() {
  const [comments, setComments] = useState(DEFAULT_COMMENTS);
  const [newComment, setNewComment] = useState("");

  const addComment = () => {
    if (!newComment.trim()) return;

    const nextId = comments.length ? Math.max(...comments.map(c => c.id)) + 1 : 1;
    const commentObj = { id: nextId, user: "You", text: newComment };
    setComments([...comments, commentObj]);
    setNewComment("");
  };

  const deleteComment = (id) => {
    setComments(comments.filter(c => c.id !== id));
  };

  const editComment = (id, text) => {
    setComments(
      comments.map(c => (c.id === id ? { ...c, text } : c))
    );
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: "16px", padding: "24px", maxWidth: "700px", margin: "20px auto" }}>
      <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "16px" }}>Comments</h3>

      {/* Comment List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
        {comments.map(comment => (
          <div key={comment.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e0e0e0", paddingBottom: "8px" }}>
            <div>
              <strong>{comment.user}</strong>:{" "}
              <input
                type="text"
                value={comment.text}
                onChange={(e) => editComment(comment.id, e.target.value)}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "14px",
                  width: "100%",
                }}
              />
            </div>
            <button
              onClick={() => deleteComment(comment.id)}
              style={{
                marginLeft: "12px",
                background: "#ff4d4f",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "4px 8px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* New Comment Input */}
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "14px",
          }}
        />
        <button
          onClick={addComment}
          style={{
            background: "#333333",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Post
        </button>
      </div>
    </div>
  );
}

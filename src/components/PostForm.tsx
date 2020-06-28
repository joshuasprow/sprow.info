import React, { useState } from "react";
import { PostDoc, useAppContext } from "../context";
import { db, newTimestamp } from "../firebase";

const createPost = async (post: PostDoc) => {
  const doc = db.collection("posts").doc();

  await doc.set(post);
};

export default function PostForm() {
  const { userDoc: user } = useAppContext();
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);

  const disabled = !user;

  const handleChange: React.InputHTMLAttributes<
    HTMLInputElement
  >["onChange"] = (event) => setMessage(event.currentTarget.value);

  const handleSubmit: React.FormHTMLAttributes<
    HTMLFormElement
  >["onSubmit"] = async (event) => {
    if (!user) return;

    event.preventDefault();

    setCreating(true);

    await createPost({ creationTime: newTimestamp(), message, uid: user.uid });

    setCreating(false);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        disabled={disabled || creating}
        onChange={handleChange}
        placeholder="type something..."
        type="text"
        value={message}
      />
    </form>
  );
}

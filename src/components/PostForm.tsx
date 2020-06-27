import React, { useState } from "react";
import { IPostDoc, useAppContext } from "../context";
import { db } from "../firebase";

const createPost = async (post: IPostDoc) => {
  const doc = db.collection("posts").doc();

  await doc.set(post);
};

export default function PostForm() {
  const { user } = useAppContext();
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

    await createPost({ creationTime: new Date(), message, uid: user.uid });

    setCreating(false);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        disabled={disabled || creating}
        onChange={handleChange}
        type="text"
        value={message}
      />
    </form>
  );
}

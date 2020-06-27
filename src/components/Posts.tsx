import React from "react";
import { useAppContext } from "../context";

export default function Posts() {
  const { posts } = useAppContext();

  return (
    <ul>
      {posts.map((post, index) => (
        <li key={index}>{post.message}</li>
      ))}
    </ul>
  );
}

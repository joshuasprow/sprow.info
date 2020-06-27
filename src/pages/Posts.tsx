import React from "react";
import { useAppContext } from "../context";
import { PageProps } from "./types";
import PostForm from "../components/PostForm";

const Posts: PageProps = () => {
  const { posts } = useAppContext();

  return (
    <div>
      <PostForm />
      <ul>
        {posts.map((post, index) => (
          <li key={index}>{post.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;

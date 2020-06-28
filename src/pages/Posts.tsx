import React from "react";
import { useAppContext } from "../context";
import { PageProps } from "./types";
import PostForm from "../components/PostForm";
import { Redirect } from "@reach/router";

const Posts: PageProps = () => {
  const { posts, userDoc } = useAppContext();

  if (!userDoc || userDoc.role !== "admin") {
    return <Redirect noThrow to="/" />;
  }

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

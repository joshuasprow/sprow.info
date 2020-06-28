import { Box, List } from "@material-ui/core";
import { Redirect } from "@reach/router";
import React from "react";
import Post from "../components/Post";
import PostForm from "../components/PostForm";
import { useAppContext } from "../context";
import "./Posts.css";
import { PageProps } from "./types";

const Posts: PageProps = () => {
  const { posts, userDoc } = useAppContext();

  if (!userDoc || userDoc.role !== "admin") {
    return <Redirect noThrow to="/" />;
  }

  return (
    <Box
      height="100vh"
      margin="0 auto"
      maxWidth="100%"
      position="relative"
      width="40rem"
    >
      <List className="posts-list">
        {posts.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </List>
      <PostForm />
    </Box>
  );
};

export default Posts;

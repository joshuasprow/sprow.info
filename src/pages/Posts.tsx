import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { Redirect } from "@reach/router";
import React from "react";
import PostForm from "../components/PostForm";
import { useAppContext } from "../context";
import { formatTimestamp } from "../firebase";
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
          <ListItem key={index}>
            <ListItemText>
              <Typography variant="caption">
                {formatTimestamp(post.creationTime)}
              </Typography>
              <Typography variant="body1">{post.message}</Typography>
            </ListItemText>
          </ListItem>
        ))}
      </List>
      <PostForm />
    </Box>
  );
};

export default Posts;

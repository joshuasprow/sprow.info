import React from "react";
import { useAppContext } from "../context";
import { PageProps } from "./types";
import PostForm from "../components/PostForm";
import { Redirect } from "@reach/router";
import { List, ListItem, ListItemText, Typography } from "@material-ui/core";

const formatTimestamp = (timestamp: firebase.firestore.Timestamp) => {
  const dateObj = timestamp.toDate();

  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const date = dateObj.getDate();

  const hours24 = dateObj.getHours();
  const hours = hours24 > 12 ? hours24 - 12 : hours24;
  const amPm = hours24 > 11 ? "am" : "pm";

  const minutes = dateObj.getMinutes();

  return `${year}.${month}.${date} ${hours}:${minutes} ${amPm}`;
};

const Posts: PageProps = () => {
  const { posts, userDoc } = useAppContext();

  if (!userDoc || userDoc.role !== "admin") {
    return <Redirect noThrow to="/" />;
  }

  return (
    <>
      <PostForm />
      <List>
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
    </>
  );
};

export default Posts;

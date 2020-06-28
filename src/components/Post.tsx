import {
  ListItem,
  ListItemText,
  Typography,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import { PostDoc, UserDoc } from "../context";
import { db, formatTimestamp } from "../firebase";

const getPostUser = async (userId: string): Promise<UserDoc> => {
  const doc = await db.doc(`users/${userId}`).get();

  return doc.data() as UserDoc;
};

const Post: FC<{ post: PostDoc }> = ({ post }) => {
  const [postUser, setPostUser] = useState("...");

  useEffect(() => {
    getPostUser(post.userId)
      .then((doc) => setPostUser(doc.displayName || doc.email))
      .catch(console.error);
  }, [post.userId]);

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar>{postUser[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText>
        <Typography variant="caption">
          {`${formatTimestamp(post.creationTime)} - ${postUser}`}
        </Typography>
        <Typography variant="body1">{post.message}</Typography>
      </ListItemText>
    </ListItem>
  );
};

export default Post;

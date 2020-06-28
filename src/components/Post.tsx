import { ListItem, ListItemText, Typography } from "@material-ui/core";
import React, { FC } from "react";
import { PostDoc } from "../context";
import { formatTimestamp } from "../firebase";

const Post: FC<{ post: PostDoc }> = ({ post }) => {
  return (
    <ListItem>
      <ListItemText>
        <Typography variant="caption">
          {formatTimestamp(post.creationTime)}
        </Typography>
        <Typography variant="body1">{post.message}</Typography>
      </ListItemText>
    </ListItem>
  );
};

export default Post;

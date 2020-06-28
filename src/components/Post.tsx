import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  ClickAwayListener,
  IconButton,
  IconButtonProps,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Popover,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Delete as DeleteIcon, Edit as EditIcon } from "@material-ui/icons";
import React, { FC, useEffect, useState } from "react";
import { PostDoc, useAppContext, UserDoc } from "../context";
import { db, formatTimestamp } from "../firebase";

interface PostProps {
  post: PostDoc;
}

const getPostUser = async (userId: string) => {
  const doc = await db.doc(`users/${userId}`).get();

  return doc.data() as UserDoc;
};

const DeleteButton: FC<
  Pick<PostProps, "post"> & {
    setUpdating: React.Dispatch<React.SetStateAction<boolean>>;
    updating: boolean;
  }
> = ({ post, setUpdating, updating }) => {
  const [buttonEl, setButtonEl] = useState<HTMLButtonElement | null>(null);

  const [open, setOpen] = useState(false);

  const handleIconButton: IconButtonProps["onClick"] = (event) => {
    setButtonEl(event.currentTarget);
    setOpen(true);
  };

  const closePopover = () => setOpen(false);

  const deletePost = async () => {
    setUpdating(true);

    db.doc(`posts/${post.postId}`).delete();

    setUpdating(false);
    closePopover();
  };

  return (
    <>
      <IconButton disabled={updating} onClick={handleIconButton} size="small">
        <DeleteIcon fontSize="inherit" />
      </IconButton>
      <Popover
        anchorEl={buttonEl}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        open={open}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <ClickAwayListener onClickAway={closePopover}>
          <Box
            alignItems="center"
            display="flex"
            flexDirection="column"
            padding="0.5rem"
          >
            <Typography variant="h6">Delete this post?</Typography>
            <ButtonGroup>
              <Button
                color="secondary"
                disabled={updating}
                onClick={deletePost}
                size="small"
              >
                Ok
              </Button>
              <Button disabled={updating} onClick={closePopover} size="small">
                Cancel
              </Button>
            </ButtonGroup>
          </Box>
        </ClickAwayListener>
      </Popover>
    </>
  );
};

const Post: FC<PostProps> = ({ post }) => {
  const { userDoc } = useAppContext();
  const [postUser, setPostUser] = useState("...");

  const canUpdate =
    userDoc && (userDoc.userId === post.userId || userDoc.role === "admin");

  const [updating, setUpdating] = useState(false);

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
      <ListItemSecondaryAction>
        {canUpdate && (
          <>
            <Tooltip title="Edit">
              <IconButton disabled={updating} size="small">
                <EditIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <DeleteButton
              post={post}
              setUpdating={setUpdating}
              updating={updating}
            />
          </>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default Post;

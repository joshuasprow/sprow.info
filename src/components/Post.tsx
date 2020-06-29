import {
  Avatar,
  Box,
  Button,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  IconButtonProps,
  Input,
  InputProps,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Popover,
  Typography,
} from "@material-ui/core";
import { Delete as DeleteIcon, Edit as EditIcon } from "@material-ui/icons";
import React, { FC, useEffect, useState } from "react";
import { PostDoc, useAppContext, UserDoc } from "../context";
import { db, formatTimestamp, newTimestamp } from "../firebase";
import "./Post.css";

interface PostProps {
  post: PostDoc;
}

interface PostButtonProps extends PostProps {
  setUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  updating: boolean;
}

const getPostUser = async (userId: string) => {
  const doc = await db.doc(`users/${userId}`).get();

  return doc.data() as UserDoc;
};

const EditButton: FC<PostButtonProps> = ({ post, setUpdating, updating }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(post.message);

  const disabled = updating || message === "";

  const closeDialog = () => disabled || setOpen(false);
  const openDialog = () => disabled || setOpen(true);

  const handleChange: InputProps["onChange"] = (event) =>
    setMessage(event.currentTarget.value);

  const updatePost = async () => {
    setUpdating(true);

    const update: Pick<PostDoc, "message" | "updateTime"> = {
      message,
      updateTime: newTimestamp(),
    };

    await db.doc(`/posts/${post.postId}`).update(update);

    setUpdating(false);
    closeDialog();
  };

  return (
    <>
      <IconButton disabled={updating} onClick={openDialog} size="small">
        <EditIcon fontSize="inherit" />
      </IconButton>
      <Dialog onClose={closeDialog} open={open}>
        <DialogContent className="edit-dialog-content">
          <Typography variant="caption">
            {formatTimestamp(post.creationTime)}
          </Typography>
          <Input
            fullWidth
            multiline
            onChange={handleChange}
            rowsMax={4}
            value={message}
          />
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            disabled={disabled}
            onClick={updatePost}
            variant="contained"
          >
            Update
          </Button>
          <Button disabled={updating} onClick={closeDialog}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const DeleteButton: FC<PostButtonProps> = ({ post, setUpdating, updating }) => {
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
            <Typography variant="body2">Delete this post?</Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              marginTop="0.5rem"
            >
              <Button
                color="secondary"
                disabled={updating}
                onClick={deletePost}
                size="small"
                variant="contained"
              >
                Ok
              </Button>
              <Button disabled={updating} onClick={closePopover} size="small">
                Cancel
              </Button>
            </Box>
          </Box>
        </ClickAwayListener>
      </Popover>
    </>
  );
};

const Post: FC<PostProps> = ({ post }) => {
  const { isSmallScreen, userDoc } = useAppContext();
  const isLargeScreen = !isSmallScreen;

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
    <>
      <ListItem>
        {isLargeScreen && (
          <ListItemAvatar>
            <Avatar>{postUser[0]}</Avatar>
          </ListItemAvatar>
        )}
        <ListItemText>
          {isSmallScreen ? (
            <>
              <Box>
                <Typography variant="subtitle1">{postUser}</Typography>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                marginRight="3rem"
              >
                <Typography variant="caption">
                  {formatTimestamp(post.creationTime)}
                </Typography>
                {canUpdate && (
                  <Box>
                    <EditButton
                      post={post}
                      setUpdating={setUpdating}
                      updating={updating}
                    />
                    <DeleteButton
                      post={post}
                      setUpdating={setUpdating}
                      updating={updating}
                    />
                  </Box>
                )}
              </Box>
            </>
          ) : (
            <Typography variant="caption">
              {formatTimestamp(post.creationTime)}
            </Typography>
          )}
          <Typography variant="body1">{post.message}</Typography>
        </ListItemText>
        {isLargeScreen && (
          <ListItemSecondaryAction>
            {canUpdate && (
              <>
                <EditButton
                  post={post}
                  setUpdating={setUpdating}
                  updating={updating}
                />
                <DeleteButton
                  post={post}
                  setUpdating={setUpdating}
                  updating={updating}
                />
              </>
            )}
          </ListItemSecondaryAction>
        )}
      </ListItem>
      {isSmallScreen && <Divider />}
    </>
  );
};

export default Post;

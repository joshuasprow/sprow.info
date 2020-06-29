import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Fab,
  IconButton,
  InputProps,
  TextField,
  TextFieldProps,
  useTheme,
} from "@material-ui/core";
import { Add as AddIcon, Send as SendIcon } from "@material-ui/icons";
import React, { FC, useState } from "react";
import { PostDoc, useAppContext } from "../context";
import { db, newTimestamp } from "../firebase";
import "./PostForm.css";

const createPost = async (post: Omit<PostDoc, "postId">) => {
  const doc = db.collection("posts").doc();
  const postId = doc.id;

  await doc.set({ ...post, postId });
};

interface FormProps {
  handleChange: TextFieldProps["onChange"];
  handleKeyPress: TextFieldProps["onKeyPress"];
  message: string;
  submit: () => Promise<void>;
  submitDisabled: boolean;
  textFieldDisabled: boolean;
}

const BottomForm: FC<FormProps> = ({
  handleChange,
  handleKeyPress,
  message,
  submit,
  submitDisabled,
  textFieldDisabled,
}) => {
  const theme = useTheme();

  return (
    <Box
      className="post-form__bottom"
      style={{ backgroundColor: theme.palette.background.default }}
    >
      <TextField
        InputProps={{
          endAdornment: (
            <IconButton
              color="primary"
              disabled={submitDisabled}
              onClick={submit}
            >
              <SendIcon />
            </IconButton>
          ),
        }}
        disabled={textFieldDisabled}
        fullWidth
        hiddenLabel
        multiline
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        placeholder="What would you like to post?"
        rowsMax={4}
        value={message}
        variant="filled"
      />
    </Box>
  );
};

const ButtonForm: FC<FormProps> = ({
  handleChange,
  handleKeyPress,
  message,
  submit,
  submitDisabled,
  textFieldDisabled,
}) => {
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  const handleSubmit = async () => {
    await submit();
    closeDialog();
  };

  return (
    <>
      <Fab className="post-form__button" color="primary" onClick={openDialog}>
        <AddIcon />
      </Fab>
      <Dialog fullWidth onClose={closeDialog} open={open}>
        <DialogContent>
          <TextField
            disabled={textFieldDisabled}
            fullWidth
            hiddenLabel
            multiline
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="What would you like to post?"
            rows={6}
            value={message}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <IconButton color="primary" onClick={handleSubmit}>
            <SendIcon />
          </IconButton>
          <Button onClick={closeDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default function PostForm() {
  const { isSmallScreen, userDoc } = useAppContext();

  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);

  const textFieldDisabled = !userDoc || creating;
  const submitDisabled = textFieldDisabled || message === "";

  const handleChange: TextFieldProps["onChange"] = (event) =>
    setMessage(event.currentTarget.value);

  const submit = async () => {
    if (!userDoc) return;

    setCreating(true);

    await createPost({
      creationTime: newTimestamp(),
      message,
      userId: userDoc.userId,
      updateTime: null,
    });

    setCreating(false);

    setMessage("");
  };

  const handleKeyPress: InputProps["onKeyPress"] = async (event) => {
    if (event.key !== "Enter") return;

    await submit();
  };

  if (isSmallScreen) {
    return (
      <ButtonForm
        handleChange={handleChange}
        handleKeyPress={handleKeyPress}
        message={message}
        submit={submit}
        submitDisabled={submitDisabled}
        textFieldDisabled={textFieldDisabled}
      />
    );
  }

  return (
    <BottomForm
      handleChange={handleChange}
      handleKeyPress={handleKeyPress}
      message={message}
      submit={submit}
      submitDisabled={submitDisabled}
      textFieldDisabled={textFieldDisabled}
    />
  );
}

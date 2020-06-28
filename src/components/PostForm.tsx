import {
  Box,
  IconButton,
  IconButtonProps,
  TextField,
  TextFieldProps,
  CircularProgress,
} from "@material-ui/core";
import { Send as SendIcon } from "@material-ui/icons";
import React, { useState } from "react";
import { PostDoc, useAppContext } from "../context";
import { db, newTimestamp } from "../firebase";
import "./PostForm.css";

const createPost = async (post: PostDoc) => {
  const doc = db.collection("posts").doc();

  await doc.set(post);
};

export default function PostForm() {
  const { userDoc } = useAppContext();
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
      uid: userDoc.uid,
    });

    setCreating(false);

    setMessage("");
  };

  const handleKeyPress: TextFieldProps["onKeyPress"] = async (event) => {
    if (event.key !== "Enter") return;

    await submit();
  };

  const handleSubmit: IconButtonProps["onClick"] = async (event) => {
    if (!userDoc) return;

    event.preventDefault();

    await submit();
  };

  return (
    <Box
      className="post-form"
      display="flex"
      bottom={0}
      position="fixed"
      width="inherit"
    >
      <TextField
        className="post-form-text-field"
        disabled={textFieldDisabled}
        fullWidth
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        onSubmit={console.log}
        placeholder="What would you like to post?"
        value={message}
        variant="filled"
      />
      <IconButton disabled={submitDisabled} onClick={handleSubmit}>
        <SendIcon />
      </IconButton>
    </Box>
  );
}

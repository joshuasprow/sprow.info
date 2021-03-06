import {
  Box,
  IconButton,
  IconButtonProps,
  Input,
  InputProps,
  TextFieldProps,
} from "@material-ui/core";
import { Send as SendIcon } from "@material-ui/icons";
import React, { useState } from "react";
import { PostDoc, useAppContext } from "../context";
import { db, newTimestamp } from "../firebase";
import "./PostForm.css";

const createPost = async (post: Omit<PostDoc, "postId">) => {
  const doc = db.collection("posts").doc();
  const postId = doc.id;

  await doc.set({ ...post, postId });
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
      <Input
        className="post-form-text-field"
        disabled={textFieldDisabled}
        fullWidth
        multiline
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        onSubmit={console.log}
        placeholder="What would you like to post?"
        rowsMax={4}
        value={message}
      />
      <IconButton
        color="primary"
        disabled={submitDisabled}
        onClick={handleSubmit}
      >
        <SendIcon />
      </IconButton>
    </Box>
  );
}

import { useMutation } from "@tanstack/react-query";
import classes from "./AddFriend.module.css";
import { sendFriendReq } from "../util/https";
import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";

export default function AddFriend() {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?.id;

  const { mutate } = useMutation({
    mutationFn: sendFriendReq,
    onSuccess: (data) => {
      setMessage(data.message);
      setMessageType("success");
    },
    onError: (error) => {
      setMessage(error.message);
      setMessageType("error");
    },
  });

  function handleAddFriend(event) {
    event.preventDefault();

    const enteredUsername = event.target.username.value;

    if (!enteredUsername.trim()) {
      return;
    }

    mutate({ senderId: id, receiverUsername: enteredUsername });
    event.target.reset();
  }

  return (
    <div>
      <div className={classes.add}>
        <h2>Add Friend</h2>
        <p>You can add friends with their Chat username.</p>
      </div>
      <form className={classes.addForm} onSubmit={handleAddFriend}>
        <input
          type="text"
          placeholder="By username"
          className={classes.addInput}
          name="username"
        />
        <Button type="submit" variant="contained" color="success">
          <AddIcon />
        </Button>
      </form>
      <p style={{ color: messageType === "success" ? "green" : "red" }}>
        {message}
      </p>
    </div>
  );
}

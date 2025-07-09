import classes from "./EditModal.module.css";

import { useImperativeHandle, useState } from "react";
import { useRef } from "react";
import { forwardRef } from "react";
import { createPortal } from "react-dom";
import InputLabel from "./InputLabel";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useMutation } from "@tanstack/react-query";
import { queryClient, updateUserData } from "../util/https";

const EditModal = forwardRef(function EditModal(
  { username, photoURL, email },
  ref
) {
  const [usernameEmpty, setUsernameEmpty] = useState(false);
  const [emailEmpty, setEmailEmpty] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const id = user.id;

  const dialog = useRef();

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
    };
  });

  const { mutate } = useMutation({
    mutationFn: updateUserData,
    onSuccess: () => {
      queryClient.invalidateQueries(["userById", id]);
      dialog.current.close();
    },
  });

  function handleSubmit(event) {
    event.preventDefault();

    const username = event.target.username.value.trim();
    const photoUrl = event.target.photoURL.value.trim();
    const email = event.target.email.value.trim();

    let hasError = false;

    if (!username) {
      setUsernameEmpty(true);
      hasError = true;
    } else {
      setUsernameEmpty(false);
    }

    if (!email) {
      setEmailEmpty(true);
      hasError = true;
    } else {
      setEmailEmpty(false);
    }

    if (hasError) return;

    const formData = {
      username,
      photo_url: photoUrl,
      email,
    };

    mutate({ updatedData: formData, userId: id });
  }

  return createPortal(
    <dialog ref={dialog} className={classes["edit-modal"]}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >
        <h1 style={{ margin: 0 }}>Edit Profile</h1>
        <IconButton
          onClick={() => dialog.current.close()}
          style={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <form onSubmit={handleSubmit}>
        <InputLabel
          label="Username"
          placeholderText="Enter username"
          forr="username"
          type="text"
          defaultValue={username || ""}
          err={usernameEmpty}
          errText="Please fill this field"
        />
        <InputLabel
          label="Photo URL"
          placeholderText="Enter photo_url"
          forr="photoURL"
          type="text"
          defaultValue={photoURL}
        />
        <InputLabel
          label="Email"
          placeholderText="Enter email"
          forr="email"
          type="email"
          defaultValue={email}
          err={emailEmpty}
          errText="Please fill this field"
        />
        <input type="submit" value="Update" />
      </form>
    </dialog>,
    document.getElementById("modal")
  );
});

export default EditModal;

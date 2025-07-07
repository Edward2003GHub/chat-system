import classes from "./EditModal.module.css";

import { useImperativeHandle } from "react";
import { useRef } from "react";
import { forwardRef } from "react";
import { createPortal } from "react-dom";
import InputLabel from "./InputLabel";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const EditModal = forwardRef(function EditModal(
  { username, photoURL, email },
  ref
) {
  const dialog = useRef();

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
    };
  });

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
      <form>
        <InputLabel
          label="Username"
          placeholderText="Enter username"
          forr="username"
          type="text"
          defaultValue={username || ""}
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
        />
        <input type="submit" value="Update" />
      </form>
    </dialog>,
    document.getElementById("modal")
  );
});

export default EditModal;

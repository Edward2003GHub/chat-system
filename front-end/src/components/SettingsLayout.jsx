import SettingsIcon from "@mui/icons-material/Settings";
import classes from "./SettingsLayout.module.css";
import { useQuery } from "@tanstack/react-query";
import { fetchUsersById } from "../util/https";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRef } from "react";
import EditModal from "./EditModal";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";

export default function SettingsLayout() {
  const navigate = useNavigate();
  const dialog = useRef();
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user.id;

  function handleEdit() {
    dialog.current.open();
  }

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  const { data, isPending } = useQuery({
    queryKey: ["userById", id],
    queryFn: () => fetchUsersById(id),
    enabled: !!id,
  });

  if (isPending) {
    return <p>Please wait...</p>;
  }

  return (
    <>
      <EditModal
        ref={dialog}
        username={data.username}
        photoURL={data.photo_url}
        email={data.email}
      />
      <div className={classes.firstCon}>
        <SettingsIcon style={{ marginBottom: "30px", fontSize: "50px" }} />

        <h2 style={{ color: "white" }}>Settings</h2>
        <p>You can edit your profile here.</p>
      </div>
      <div className={classes.secondCon}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <img src={data.photo_url ? data.photo_url : "/who.jpg"} alt="" />
          <div>
            <Button
              color="success"
              variant="outlined"
              style={{
                alignSelf: "flex-start",
                textTransform: "none",
                marginRight: "5px",
              }}
              onClick={handleEdit}
            >
              Edit Profile&nbsp;<EditIcon />
            </Button>
            <Button
              color="error"
              variant="outlined"
              style={{ alignSelf: "flex-start", textTransform: "none" }}
              onClick={handleLogout}
            >
              Logout&nbsp;<LogoutIcon />
            </Button>
          </div>
        </div>
        <h5>Your name</h5>
        <h4 style={{ color: "white", marginBottom: "30px" }}>
          {data.username}
        </h4>
        <h5>Your email</h5>
        <h4 style={{ color: "white", marginBottom: "30px" }}>{data.email}</h4>

        <Button
          variant="outlined"
          color="error"
          style={{ textTransform: "none" }}
        >
          Delete Account&nbsp;
          <DeleteIcon />
        </Button>
      </div>
    </>
  );
}

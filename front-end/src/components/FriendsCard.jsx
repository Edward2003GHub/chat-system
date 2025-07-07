import { useNavigate } from "react-router-dom";

import ForumIcon from "@mui/icons-material/Forum";
import IconButton from "@mui/material/IconButton";

export default function FriendsCard({ id, image, username }) {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(134, 150, 160, 0.15)",
        padding: "15px",
      }}
    >
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <img
          src={image ? image : "/who.jpg"}
          alt=""
          style={{ width: "50px", height: "50px", borderRadius: "50%" }}
        />
        <h3 style={{ color: "white", margin: 0 }}>{username}</h3>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <IconButton
          onClick={() => navigate(`/user/chat/${id}`)}
          style={{ color: "green" }}
        >
          <ForumIcon />
        </IconButton>
      </div>
    </div>
  );
}

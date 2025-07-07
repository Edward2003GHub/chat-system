import { NavLink } from "react-router-dom";
import "./UserCard.css";

export default function UserCard({ id, name, photo, lastMessage, time }) {
  return (
    <NavLink
      to={`/user/chat/${id}`}
      style={{ textDecoration: "none" }}
      className={({ isActive }) => (isActive ? "link-active" : undefined)}
    >
      <div className="user-card">
        <div className="img-n-details">
          <div>
            <img src={photo} alt={photo} />
          </div>
          <div>
            <div>
              {JSON.parse(localStorage.getItem("user")).id === id
                ? "You"
                : name}
            </div>{" "}
            <div style={{ color: "gray" }}>
              {lastMessage?.length > 30
                ? lastMessage.slice(0, 20) + "..."
                : lastMessage}
            </div>
          </div>
        </div>
        <div style={{ color: "gray", fontSize: "10px" }}>{time}</div>
      </div>
    </NavLink>
  );
}

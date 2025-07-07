import { NavLink, Outlet } from "react-router-dom";
import Diversity2Icon from "@mui/icons-material/Diversity2";
import "./Friends.css";

export default function Friends() {
  return (
    <>
      <div className="first-con">
        <Diversity2Icon style={{ marginBottom: "30px", fontSize: "50px" }} />

        <h2 style={{ color: "white" }}>Friends</h2>
        <p>You can add friends and chat with them.</p>
      </div>
      <div className="second-con">
        <div className="controls">
          <NavLink
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
            to=""
            end
          >
            All
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
            to="pending"
          >
            Pending
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? "active-link" : undefined)}
            to="add"
          >
            Add Friend
          </NavLink>
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </>
  );
}

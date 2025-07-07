import "./User.css";

import { NavLink, Outlet } from "react-router-dom";
import ChatIcon from "@mui/icons-material/Chat";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SettingsApplicationsOutlinedIcon from "@mui/icons-material/SettingsApplicationsOutlined";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";

export default function User() {
  return (
    <div className="center-div">
      <div className="outter-container">
        <div className="nav-bar">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <NavLink to="chat">
              {({ isActive }) =>
                isActive ? <ChatIcon /> : <ChatOutlinedIcon />
              }
            </NavLink>

            <NavLink to="friends">
              {({ isActive }) =>
                isActive ? <PeopleAltIcon /> : <PeopleAltOutlinedIcon />
              }
            </NavLink>
          </div>
          <NavLink to="settings">
            {({ isActive }) =>
              isActive ? (
                <SettingsApplicationsIcon />
              ) : (
                <SettingsApplicationsOutlinedIcon />
              )
            }
          </NavLink>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

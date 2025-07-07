import { Link, Outlet, useNavigate } from "react-router-dom";
import "../pages/User.css";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { useEffect, useState } from "react";
import Users from "./Users";

export default function ChatLayout() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  function handleLogout() {
    localStorage.clear();
    navigate("/");
  }

  function handleChange(event) {
    setSearch(event.target.value);
  }

  function resetSearch() {
    setSearch("");
    setDebouncedSearch("");
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <>
      <div className="search-user-div">
        <div className="search">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link to="/user/chat" className="chats">
              <div
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <img
                  src="/chatSystem.svg"
                  alt=""
                  style={{ width: "30px", height: "30px" }}
                />
                <h2 style={{ margin: 0 }}>Chats</h2>
              </div>
            </Link>
            <IconButton onClick={handleLogout} style={{ color: "red" }}>
              <LogoutIcon />
            </IconButton>
          </div>
          <input
            type="search"
            placeholder="Search"
            onChange={handleChange}
            value={search}
          />
        </div>
        <Users search={debouncedSearch} />
      </div>
      <Outlet context={{ resetSearch }} />
    </>
  );
}

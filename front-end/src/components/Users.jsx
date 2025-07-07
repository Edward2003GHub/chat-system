import UserCard from "./UserCard";
import "./Users.css";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../util/https";
import { formatDate } from "../util/formatDate";

export default function Users({ search }) {
  const loggedUserId = JSON.parse(localStorage.getItem("user")).id;

  const { data, isPending, error } = useQuery({
    queryKey: ["users", loggedUserId, search],
    queryFn: () => fetchUsers(loggedUserId, search),
    enabled: !!loggedUserId,
  });

  let content;

  if (isPending) {
    content = <p style={{ color: "white" }}>Loading users...</p>;
  } else if (error) {
    content = <p style={{ color: "white" }}>Failed to load users</p>;
  } else if (data?.length === 0) {
    content = <p style={{ color: "white" }}>No users found</p>;
  } else {
    content = data.map((user) => (
      <UserCard
        key={user.id}
        id={user.id}
        name={user.username}
        photo={user.photo_url ? user.photo_url : '/who.jpg'}
        time={formatDate(user.last_timestamp)}
        lastMessage={
          loggedUserId === user.sender_id
            ? `You: ${user.last_message}`
            : user.last_message
        }
      />
    ));
  }

  return <div className="users">{content}</div>;
}

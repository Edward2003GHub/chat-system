import { useMutation } from "@tanstack/react-query";
import { formatDate } from "../util/formatDate";
import {
  acceptFriendRequest,
  queryClient,
  rejectFriendRequest,
} from "../util/https";

import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

export default function PendingCard({
  requestId,
  username,
  timeCreated,
  image,
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?.id;

  const { mutate: accept } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingFriendRequests", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["getFriends", id],
      });
    },
  });

  const { mutate: reject } = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingFriendRequests", id],
      });
    },
  });

  function handleAccept() {
    accept({ requestId });
  }

  function handleReject() {
    reject({ requestId });
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
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
        <div style={{ color: "white" }}>
          <h3>{username}</h3>
          <span>{formatDate(timeCreated)}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: "5px" }}>
        <IconButton onClick={handleAccept} style={{ color: "green" }}>
          <DoneIcon />
        </IconButton>
        <IconButton onClick={handleReject} style={{ color: "red" }}>
          <CloseIcon />
        </IconButton>
      </div>
    </div>
  );
}

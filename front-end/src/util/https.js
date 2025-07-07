import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export async function register(regData) {
  const response = await fetch("http://localhost:4000/register", {
    method: "POST",
    body: JSON.stringify(regData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Register failed");
  }

  return await response.json();
}

export async function login(regData) {
  const response = await fetch("http://localhost:4000/login", {
    method: "POST",
    body: JSON.stringify(regData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  return await response.json();
}

export async function fetchUsers(id, searchTerm = "") {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const url = searchTerm
    ? `http://localhost:4000/users/${id}?q=${encodeURIComponent(searchTerm)}`
    : `http://localhost:4000/users/${id}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return await response.json();
}

export async function fetchUsersById(id) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const response = await fetch(`http://localhost:4000/user/${id}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch a user");
  }

  return await response.json();
}

export async function fetchMessages({ senderId, receiverId }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const response = await fetch("http://localhost:4000/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ sender_id: senderId, receiver_id: receiverId }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  return await response.json();
}

export async function sendMessages({ senderId, receiverId, content }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const response = await fetch("http://localhost:4000/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      sender_id: senderId,
      receiver_id: receiverId,
      content: content,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to send a message");
  }

  return await response.json();
}

export async function pendingFriendReq({ userId }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  try {
    const response = await fetch(
      `http://localhost:4000/friend-requests/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch friend requests.");
    }

    return data;
  } catch (err) {
    console.error("Error fetching pending requests:", err.message);
    throw err;
  }
}

export async function sendFriendReq({ senderId, receiverUsername }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  try {
    const response = await fetch("http://localhost:4000/friend-request", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        senderId,
        receiverUsername,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to send friend request.");
    }

    return data;
  } catch (error) {
    console.error("Friend request error:", error.message);
    throw error;
  }
}

export async function acceptFriendRequest({ requestId }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const response = await fetch("http://localhost:4000/friend-request/accept", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ requestId }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to accept friend request");
  }

  return await response.json();
}

export async function rejectFriendRequest({ requestId }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  const response = await fetch("http://localhost:4000/friend-request/reject", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ requestId }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to reject friend request");
  }

  return await response.json();
}

export async function showFriends({ userId }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  try {
    const response = await fetch(`http://localhost:4000/friends/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch friends.");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

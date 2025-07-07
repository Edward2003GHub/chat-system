import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "../util/https";
import "./Chat.css";
import { useEffect, useRef } from "react";
import { formatDate } from "../util/formatDate";

export default function Chat({ receiverId }) {
  const sender = JSON.parse(localStorage.getItem("user"));
  const senderId = sender?.id;

  const containerRef = useRef(null);

  const {
    data: messages,
    isPending,
    error,
  } = useQuery({
    queryKey: ["messages", senderId, receiverId],
    queryFn: () => fetchMessages({ senderId, receiverId }),
    enabled: !!senderId && !!receiverId,
  });

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (isPending) return <p>Loading messages...</p>;

  if (error) return <p>Error loading messages.</p>;

  return (
    <div className="chat-container" ref={containerRef}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`each-message-con ${
            msg.sender_id === senderId ? "sent" : "received"
          }`}
        >
          <div
            className={`each-message ${
              msg.sender_id === senderId ? "sent" : "received"
            }`}
          >
            {msg.content}
            <p>{formatDate(msg.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

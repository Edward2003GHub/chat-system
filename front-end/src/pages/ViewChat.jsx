import { useOutletContext, useParams } from "react-router-dom";
import Chat from "../components/Chat";
import "./ViewChat.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchUsersById, queryClient, sendMessages } from "../util/https";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";

export default function ViewChat() {
  const { id } = useParams();
  const { resetSearch } = useOutletContext();

  const { data, isPending } = useQuery({
    queryKey: ["userById", id],
    queryFn: () => fetchUsersById(id),
    enabled: !!id,
  });

  const senderId = JSON.parse(localStorage.getItem("user"))?.id;
  const receiverId = data?.id;

  const { mutate } = useMutation({
    mutationFn: sendMessages,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", senderId, receiverId],
      });
      queryClient.invalidateQueries({
        queryKey: ["users", senderId],
      });
    },
  });

  function handleSubmit(e) {
    e.preventDefault();

    const sender = JSON.parse(localStorage.getItem("user"))?.id;
    const receiver = data?.id;
    const message = e.target.message.value;

    if (!sender || !receiver || !message.trim()) return;

    mutate({
      senderId: sender,
      receiverId: receiver,
      content: message,
    });

    e.target.reset();
    resetSearch();
  }

  let content;

  if (isPending) {
    content = <div>Please wait...</div>;
  }

  console.log(data);

  if (data) {
    content = (
      <div className="photo-username">
        <img src={data.photo_url ? data.photo_url : "/who.jpg"} alt="" />
        {JSON.parse(localStorage.getItem("user")).id === data.id
          ? "You"
          : data.username}
      </div>
    );
  }

  return (
    <div className="view-chat-div">
      {content}

      <Chat receiverId={data?.id} />
      <div className="input-area">
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="type a message" name="message" />
          <Button variant="text" type="submit">
            <SendIcon />
          </Button>
        </form>
      </div>
    </div>
  );
}

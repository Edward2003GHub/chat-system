import { useQuery } from "@tanstack/react-query";
import { pendingFriendReq } from "../util/https";
import PendingCard from "../components/PendingCard";

export default function PendingReq() {
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user?.id;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["pendingFriendRequests", id],
    queryFn: () => pendingFriendReq({ userId: id }),
    enabled: !!id,
  });

  console.log(data);

  let content;

  if (isLoading) {
    content = <p style={{ color: "white" }}>Please wait...</p>;
  } else if (isError) {
    content = (
      <p style={{ color: "white" }}>
        Something went wrong, please try again later.
      </p>
    );
  } else if (data.length === 0) {
    content = <p style={{ color: "white" }}>There's no pending requests.</p>;
  } else {
    content = data.map((pending) => (
      <PendingCard
        key={pending.id}
        requestId={pending.request_id}
        username={pending.username}
        timeCreated={pending.created_at}
        image={pending.photo_url}
      />
    ));
  }

  return content;
}

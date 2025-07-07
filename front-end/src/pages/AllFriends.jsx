import { useQuery } from "@tanstack/react-query";
import FriendsCard from "../components/FriendsCard";
import { showFriends } from "../util/https";

export default function AllFriends() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getFriends", userId],
    queryFn: () => showFriends({ userId }),
    enabled: !!userId,
  });

  console.log(data);

  if (isLoading) {
    return <p style={{ color: "white" }}>Please wait...</p>;
  }

  if (isError) {
    return <p style={{ color: "white" }}>Error fetching friends</p>;
  }

  if (data.length === 0) {
    return <p style={{ color: "white" }}>You have no friends</p>;
  }

  return (
    <>
      {data.map((item) => (
        <FriendsCard
          key={item.id}
          id={item.id}
          image={item.photo_url}
          username={item.username}
        />
      ))}
    </>
  );
}

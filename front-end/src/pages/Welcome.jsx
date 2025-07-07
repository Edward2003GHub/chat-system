import "./Welcome.css";

export default function Welcome() {
  return (
    <div className="welcome">
      <div align="center">
        <img
          src="/chatSystem.svg "
          alt=""
          style={{ width: "150px", height: "150px" }}
        />
        <h1>
          Welcome to the{" "}
          <span style={{ color: "green", fontWeight: "bold" }}>BEST</span>
        </h1>
        <h2>Chatting app</h2>
        <p style={{ color: "gray" }}>
          Search for users to start the conversation.
        </p>
      </div>
    </div>
  );
}

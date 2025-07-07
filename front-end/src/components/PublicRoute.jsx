import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.token) {
    return <Navigate to="/user" replace />;
  }

  return children;
}

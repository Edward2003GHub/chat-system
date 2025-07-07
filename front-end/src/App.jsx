import { createBrowserRouter, RouterProvider } from "react-router-dom";
import User from "./pages/User";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./util/https";
import PublicRoute from "./components/PublicRoute";
import ViewChat from "./pages/ViewChat";
import Welcome from "./pages/Welcome";
import Friends from "./pages/Friends";
import AllFriends from "./pages/AllFriends";
import PendingReq from "./pages/PendingReq";
import AddFriend from "./pages/AddFriend";
import ChatLayout from "./components/ChatLayout";
import SettingsLayout from "./components/SettingsLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <User />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "chat",
        element: <ChatLayout />,
        children: [
          { index: true, element: <Welcome /> },
          { path: ":id", element: <ViewChat /> },
        ],
      },
      {
        path: "friends",
        element: <Friends />,
        children: [
          { index: true, element: <AllFriends /> },
          { path: "pending", element: <PendingReq /> },
          { path: "add", element: <AddFriend /> },
        ],
      },
      {
        path: "settings",
        element: <SettingsLayout />,
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;

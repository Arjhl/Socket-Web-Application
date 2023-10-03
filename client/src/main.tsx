import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import Login from "./components/Login.tsx";
import UserDetails from "./components/UserDetails.tsx";
import Dashboard from "./components/Dashboard.tsx";
import { AccountContextProvider } from "./store/accountContext.tsx";
import socket from "./conn/webSocket.tsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Protected from "./Protected.tsx";

socket.on("connect", async () => {
  console.log("socket connected");
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/:id/userdetails",
    element: <UserDetails />,
  },
  {
    path: "/reset",
    element: "Under Development",
  },
  {
    path: "/dashboard",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },
  {
    path: "/dashboard/:id",
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AccountContextProvider>
    <RouterProvider router={router} />
  </AccountContextProvider>
);

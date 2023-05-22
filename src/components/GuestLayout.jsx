import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateUser } from "../store/useStateGeneral";

export default function GuestLayout() {
  const { token } = useStateUser((state) => ({
    token: state.token,
  }));

  if (token) {
    return <Navigate to="/" />;
  }
  return (
    <div>
      <Outlet />
    </div>
  );
}

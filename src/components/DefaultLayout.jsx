import React, { useEffect } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateUser } from "../store/useStateGeneral";
import axiosClient from "../axios-client";

export default function DefaultLayout() {
  const { user, token, notification } = useStateUser((state) => ({
    user: state.user,
    token: state.token,
    notification: state.notification,
  }));

  const { setUser, setToken } = useStateUser();

  if (!token) {
    return <Navigate to="/login" />;
  }

  const logout = (ev) => {
    ev.preventDefault();

    axiosClient.post("/logout").then(() => {
      setToken(null);
      setUser({});
    });
  };

  return (
    <div id="defaultLayout">
      <aside>
        <Link to="/dashboard">Panel de Administración</Link>
        <Link to="/users">Usuarios</Link>
      </aside>
      <div className="content">
        <header>
          <div>Header</div>
          <div>
            {user.name}{" "}
            <a href="#" onClick={logout} className="btn-logout">
              Cerrar Sesión
            </a>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
}

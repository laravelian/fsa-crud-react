import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateUser } from "../store/useStateGeneral";

export default function UserForm() {
  const { id } = useParams();
  const [errores, setErrores] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    //{ ...user, name: ev.target.value }: Esto es una sintaxis llamada "spread operator" (...user) que crea una copia del objeto user existente. Luego, se especifica la propiedad name con el valor ev.target.value, que representa el nuevo valor del elemento de entrada.
  });

  const { setNotification } = useStateUser();

  const { notification } = useStateUser((state) => ({
    notification: state.notification,
  }));

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setUser(data);
          console.log(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  const onSubmit = (ev) => {
    ev.preventDefault();

    if (user.id) {
      axiosClient
        .put(`/users/${user.id}`, user)
        .then(() => {
          setNotification("Registro actualizado correctamente");
          navigate("/users");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrores(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post(`/users`, user)
        .then(() => {
          setNotification("Registro creado correctamente");
          navigate("/users");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrores(response.data.errors);
          }
        });
    }
  };

  return (
    <>
      {user.id && <h1>Actualizar Registro: {user.name}</h1>}
      {!user.id && <h1>Nuevo Registro</h1>}
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Cargando...</div>}
        {errores && (
          <div className="alert">
            {Object.keys(errores).map((key) => (
              <p key={key}>{errores[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              onChange={(ev) => setUser({ ...user, name: ev.target.value })}
              value={user.name}
              type="text"
              placeholder="Nombre"
            />
            <input
              onChange={(ev) => setUser({ ...user, email: ev.target.value })}
              value={user.email}
              type="email"
              placeholder="Email"
            />
            <input
              onChange={(ev) => setUser({ ...user, password: ev.target.value })}
              type="password"
              placeholder="Contraseña"
            />
            <input
              onChange={(ev) =>
                setUser({ ...user, password_confirmation: ev.target.value })
              }
              type="password"
              placeholder="Repetir Contraseña"
            />
            <button className="btn">Guardar</button>
          </form>
        )}
      </div>
    </>
  );
}

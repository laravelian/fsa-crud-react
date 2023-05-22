import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateUser } from "../store/useStateGeneral";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();

  const { setToken, setUser } = useStateUser();

  const [errores, setErrores] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    axiosClient
      .post("/login", payload)
      .then(({ data }) => {
        setToken(data.token);
        setUser(data.user);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          if (response.data.errors) {
            setErrores(response.data.errors);
          } else {
            setErrores({
              email: [response.data.message],
            });
          }
        }
      });
  };
  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Iniciar Sesión</h1>
          {errores && (
            <div className="alert">
              {Object.keys(errores).map((key) => (
                <p key={key}>{errores[key][0]}</p>
              ))}
            </div>
          )}
          <input ref={emailRef} type="email" placeholder="Email" />
          <input ref={passwordRef} type="password" placeholder="Contraseña" />
          <button className="btn btn-block">Iniciar Sesión</button>
          <div className="message">
            No tienes cuenta? <Link to="/signup">Regístrate</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateUser } from "../store/useStateGeneral";

export default function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();

  const [errores, setErrores] = useState(null);

  const { setUser, setToken } = useStateUser();

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };
    console.log(payload);

    axiosClient
      .post("/signup", payload)
      .then(({ data }) => {
        setToken(data.token);
        setUser(data.user);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrores(response.data.errors);
        }
      });
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Regístrate</h1>
          {errores && (
            <div className="alert">
              {Object.keys(errores).map((key) => (
                <p key={key}>{errores[key][0]}</p>
              ))}
            </div>
          )}
          <input ref={nameRef} type="text" placeholder="Nombre Completo" />
          <input ref={emailRef} type="email" placeholder="Email" />
          <input ref={passwordRef} type="password" placeholder="Contraseña" />
          <input
            ref={passwordConfirmationRef}
            type="password"
            placeholder="Repetir Contraseña"
          />
          <button className="btn btn-block">Registrar Cuenta</button>
          <div className="message">
            Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

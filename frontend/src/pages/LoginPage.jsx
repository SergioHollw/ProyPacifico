import { useState } from "react";
import { useNavigate } from "../utils/router";
import { useAuth } from "../hooks/useAuth";
import logoPacifico from "../assets/logo-pacifico-cropped.png";
import "../styles/Login.css";

const ROL_REDIRECT = {
  COLABORADOR: "/dashboard",
  TECNICO: "/bandeja",
  ADMINISTRADOR: "/admin-panel",
};

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await login(usuario, password);
      const destino = ROL_REDIRECT[result.user?.rol] || "/dashboard";
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card slide-up">
        <div className="login-logo">
          <img src={logoPacifico} alt="Pacífico Seguros" className="login-logo-img" />
          <h1 className="login-title">Pacífico Seguros</h1>
          <p className="login-subtitle">Portal de Gestión ITSM</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              type="text"
              className="input"
              placeholder="Ingrese su usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoFocus
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg login-btn" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar al Sistema"}
          </button>
        </form>
      </div>
    </div>
  );
}
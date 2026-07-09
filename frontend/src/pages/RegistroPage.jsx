import { useState } from "react";
import { useNavigate, Link } from "../utils/router";
import { register } from "../services/auth.service";
import logoPacifico from "../assets/logo-pacifico-cropped.png";
import "../styles/Login.css";
import "../styles/Registro.css";

export default function RegistroPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmar: "",
    area: "",
  });
  const [errores, setErrores] = useState({});

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: null }));
    if (error) setError("");
  };

  const validar = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = "El nombre es obligatorio";
    if (!form.email.trim()) errs.email = "El correo es obligatorio";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Correo inválido";
    if (!form.password) errs.password = "La contraseña es obligatoria";
    else if (form.password.length < 6) errs.password = "Mínimo 6 caracteres";
    if (form.password !== form.confirmar) errs.confirmar = "Las contraseñas no coinciden";
    if (!form.area) errs.area = "Seleccione un área";
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!validar()) return;
    setLoading(true);
    try {
      await register({
        nombre: form.nombre,
        email: form.email,
        password: form.password,
        area: form.area,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card slide-up registro-card">
        <div className="login-logo">
          <img src={logoPacifico} alt="Pacífico Seguros" className="login-logo-img" />
          <h1 className="login-title">Pacífico Seguros</h1>
          <p className="login-subtitle">Crear cuenta de usuario</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre" type="text" className={`input ${errores.nombre ? "input-error" : ""}`}
              placeholder="Ingrese su nombre" value={form.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)} autoFocus
            />
            {errores.nombre && <span className="error-text">{errores.nombre}</span>}
          </div>

          <div className="login-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email" type="email" className={`input ${errores.email ? "input-error" : ""}`}
              placeholder="correo@pacifico.com.pe" value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errores.email && <span className="error-text">{errores.email}</span>}
          </div>

          <div className="login-field">
            <label htmlFor="area">Área</label>
            <select
              id="area" className={`select ${errores.area ? "input-error" : ""}`}
              value={form.area} onChange={(e) => handleChange("area", e.target.value)}
            >
              <option value="">Seleccione...</option>
              <option value="TI / Sistemas">TI / Sistemas</option>
              <option value="Operaciones">Operaciones</option>
              <option value="Finanzas">Finanzas</option>
              <option value="Recursos Humanos">Recursos Humanos</option>
              <option value="Legal">Legal</option>
              <option value="Administración">Administración</option>
              <option value="Otro">Otro</option>
            </select>
            {errores.area && <span className="error-text">{errores.area}</span>}
          </div>

          <div className="form-row registro-row">
            <div className="login-field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password" type="password" className={`input ${errores.password ? "input-error" : ""}`}
                placeholder="Mínimo 6 caracteres" value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
              {errores.password && <span className="error-text">{errores.password}</span>}
            </div>
            <div className="login-field">
              <label htmlFor="confirmar">Confirmar contraseña</label>
              <input
                id="confirmar" type="password" className={`input ${errores.confirmar ? "input-error" : ""}`}
                placeholder="Repita la contraseña" value={form.confirmar}
                onChange={(e) => handleChange("confirmar", e.target.value)}
              />
              {errores.confirmar && <span className="error-text">{errores.confirmar}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg login-btn" disabled={loading}>
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="registro-login-link">
          ¿Ya tiene cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  );
}

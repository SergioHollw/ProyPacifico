import { useState } from "react";
import { getCurrentUser, cambiarPassword } from "../services/auth.service";
import "../styles/FormPage.css";

export default function PerfilPage() {
  const user = getCurrentUser();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCambiarPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (passwordNueva !== passwordConfirmar) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (passwordNueva.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    try {
      await cambiarPassword(passwordActual, passwordNueva);
      setSuccess("Contraseña actualizada exitosamente");
      setShowPasswordForm(false);
      setPasswordActual("");
      setPasswordNueva("");
      setPasswordConfirmar("");
    } catch (err) {
      setError(err.message);
    }
  };

  const rolBadgeClass = (rol) => {
    switch (rol) {
      case 'ADMINISTRADOR': return 'badge-open';
      case 'TECNICO': return 'badge-in-progress';
      case 'COLABORADOR': return 'badge-closed';
      default: return '';
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="form-page-header">
        <h1 className="page-title">Mi Perfil</h1>
        <p className="page-subtitle">Información de su cuenta de usuario</p>
      </div>

      <div className="card-body-section">
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid var(--color-border)" }}>
          <div className="avatar-circle avatar-circle-xl">
            {user?.nombre?.charAt(0) || "U"}
          </div>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{user?.nombre || "Usuario"}</h2>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 6 }}>{user?.email || ""}</p>
            {user?.rol && (
              <span className={`badge ${rolBadgeClass(user.rol)}`}>{user.rol_nombre || user.rol}</span>
            )}
          </div>
        </div>

        <div style={{ display: "grid", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem", alignItems: "center" }}>
            <strong style={{ fontSize: "0.813rem", color: "var(--color-text-secondary)" }}>CORREO</strong>
            <span>{user?.email || ""}</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem", alignItems: "center" }}>
            <strong style={{ fontSize: "0.813rem", color: "var(--color-text-secondary)" }}>ROL</strong>
            <span>{user?.rol_nombre || user?.rol || ""}</span>
          </div>
          {user?.area && (
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem", alignItems: "center" }}>
              <strong style={{ fontSize: "0.813rem", color: "var(--color-text-secondary)" }}>ÁREA</strong>
              <span>{user.area}</span>
            </div>
          )}
          {user?.especialidad && (
            <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: "0.5rem", alignItems: "center" }}>
              <strong style={{ fontSize: "0.813rem", color: "var(--color-text-secondary)" }}>ESPECIALIDAD</strong>
              <span>{user.especialidad}</span>
            </div>
          )}
        </div>

        <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--color-border)" }}>
          {!showPasswordForm ? (
            <button className="btn btn-outline" onClick={() => setShowPasswordForm(true)}>
              Cambiar contraseña
            </button>
          ) : (
            <form onSubmit={handleCambiarPassword}>
              {error && <div style={{ padding: "0.5rem", marginBottom: "0.75rem", background: "#fef2f2", color: "#dc2626", borderRadius: "0.375rem", fontSize: "0.875rem" }}>{error}</div>}
              {success && <div style={{ padding: "0.5rem", marginBottom: "0.75rem", background: "#f0fdf4", color: "#16a34a", borderRadius: "0.375rem", fontSize: "0.875rem" }}>{success}</div>}
              <div className="form-group">
                <label>Contraseña actual</label>
                <input type="password" className="input" value={passwordActual}
                  onChange={(e) => setPasswordActual(e.target.value)} required />
              </div>
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Nueva contraseña</label>
                  <input type="password" className="input" value={passwordNueva}
                    onChange={(e) => setPasswordNueva(e.target.value)} required minLength={6} />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Confirmar contraseña</label>
                  <input type="password" className="input" value={passwordConfirmar}
                    onChange={(e) => setPasswordConfirmar(e.target.value)} required minLength={6} />
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="submit" className="btn btn-primary">Guardar</button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowPasswordForm(false); setError(""); setSuccess(""); }}>Cancelar</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
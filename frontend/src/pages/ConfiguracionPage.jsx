import { useState } from "react";

export default function ConfiguracionPage() {
  const [notificaciones, setNotificaciones] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleGuardar = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-container fade-in">
      <div className="form-page-header">
        <h1 className="page-title">Configuración</h1>
        <p className="page-subtitle">Personalice su experiencia en el portal</p>
      </div>

      <div className="card-body-section">
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid var(--color-border)" }}>
          Preferencias de notificación
        </h3>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--color-border)" }}>
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>Notificaciones en el portal</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>Recibir alertas sobre cambios en sus tickets</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={notificaciones} onChange={() => setNotificaciones(!notificaciones)} />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--color-border)" }}>
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>Notificaciones por correo</div>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2 }}>Recibir actualizaciones en su correo electrónico</div>
          </div>
          <label className="toggle">
            <input type="checkbox" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />
            <span className="toggle-slider"></span>
          </label>
        </div>

        <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn btn-primary" onClick={handleGuardar}>Guardar cambios</button>
          {saved && <span style={{ color: "#16a34a", fontSize: "0.875rem", fontWeight: 500 }}>Cambios guardados</span>}
        </div>
      </div>
    </div>
  );
}
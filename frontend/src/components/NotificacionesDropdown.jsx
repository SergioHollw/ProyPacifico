import { useState, useEffect } from "react";
import { useNavigate } from "../utils/router";
import { getNoLeidas, marcarComoLeida, marcarTodasLeidas, contarNoLeidas } from "../services/notifications.service";

export default function NotificacionesDropdown({ onClose, setNotifCount }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getNoLeidas().then((data) => {
      setNotificaciones(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleLeer = async (id, ticketId) => {
    try {
      await marcarComoLeida(id);
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
      contarNoLeidas().then(setNotifCount);
      if (ticketId) {
        navigate(`/tickets/${ticketId}`);
        if (onClose) onClose();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarcarTodas = async () => {
    try {
      await marcarTodasLeidas();
      setNotificaciones([]);
      contarNoLeidas().then(setNotifCount);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="notif-dropdown" style={{
      position: "absolute", top: "calc(100% + 0.5rem)", right: 0,
      width: "340px", background: "#fff", borderRadius: "0.5rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 1000,
      maxHeight: "400px", display: "flex", flexDirection: "column",
      fontSize: "0.875rem",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0.75rem 1rem", borderBottom: "1px solid #e5e7eb"
      }}>
        <strong>Notificaciones</strong>
        {notificaciones.length > 0 && (
          <button className="btn btn-sm btn-ghost" onClick={handleMarcarTodas}
            style={{ fontSize: "0.75rem", padding: "0.25rem 0.5rem" }}>
            Marcar todas leídas
          </button>
        )}
      </div>
      <div style={{ overflowY: "auto", flex: 1 }}>
        {loading ? (
          <div style={{ padding: "1rem", textAlign: "center", color: "var(--color-text-secondary)" }}>
            Cargando...
          </div>
        ) : notificaciones.length === 0 ? (
          <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--color-text-secondary)" }}>
            No hay notificaciones nuevas
          </div>
        ) : (
          notificaciones.map((n) => (
            <div key={n.id} style={{
              padding: "0.75rem 1rem", cursor: "pointer",
              borderBottom: "1px solid #f3f4f6",
              transition: "background 0.15s",
            }}
              onClick={() => handleLeer(n.id, n.ticket)}
              onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
              onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ fontWeight: 500, marginBottom: "0.125rem" }}>{n.mensaje}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>
                {n.fecha_envio ? new Date(n.fecha_envio).toLocaleString("es-PE") : ""}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
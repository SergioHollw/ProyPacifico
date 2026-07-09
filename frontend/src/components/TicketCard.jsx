import { useNavigate } from "../utils/router";
import StatusBadge from "./StatusBadge";
import { PRIORITY_COLORS_HEX } from "../utils/constants";
import "../styles/TicketCard.css";

export default function TicketCard({ ticket }) {
  const navigate = useNavigate();

  const c = PRIORITY_COLORS_HEX[ticket.prioridad?.toLowerCase()] || "#e5e7eb";

  return (
    <div className="ticket-card" onClick={() => navigate(`/tickets/${ticket.id}`)}>
      <div className="ticket-card-border" style={{ background: c }} />
      <div className="ticket-card-id">#{ticket.id}</div>
      <div className="ticket-card-body">
        <div className="ticket-card-top">
          <h4 className="ticket-card-title">{ticket.detalle || ticket.titulo}</h4>
          <span className={`badge ${ticket.tipo === 'Incidente' ? 'badge-tipo-incidente' : 'badge-tipo-requerimiento'}`}>
            {ticket.tipo}
          </span>
        </div>
        <div className="ticket-card-meta">
          <span className="ticket-card-spec">{ticket.especialidad}</span>
          <span className="ticket-card-priority-dot" style={{ background: c }} />
          <span className="ticket-card-priority" style={{ color: c }}>
            {ticket.prioridad}
          </span>
          <StatusBadge estado={ticket.estado} />
          {ticket.usuario_nombre && (
            <span className="ticket-card-user">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 3, verticalAlign: "middle" }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              {ticket.usuario_nombre}
            </span>
          )}
        </div>
      </div>
      <div className="ticket-card-actions">
        <button className="btn btn-primary btn-sm" style={{
          borderRadius: "100px", padding: "4px 14px", fontWeight: 600, fontSize: "0.75rem",
          background: "linear-gradient(135deg, #2563eb, #6366f1)",
          boxShadow: "0 2px 6px rgba(37,99,235,0.25)",
          border: "none", color: "#fff", cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: "0.375rem",
          whiteSpace: "nowrap",
        }} onClick={(e) => { e.stopPropagation(); navigate(`/tickets/${ticket.id}`); }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          Ver
        </button>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Link } from "../utils/router";
import TicketCard from "../components/TicketCard";
import SlaAlert from "../components/SlaAlert";
import { getTickets, getTicketsSlaVencidos } from "../services/tickets.service";
import { getCurrentUser } from "../services/auth.service";
import "../styles/ListPage.css";

export default function RequerimientosPage() {
  const [tickets, setTickets] = useState([]);
  const [slaVencidos, setSlaVencidos] = useState([]);
  const [filtro, setFiltro] = useState("Todos");
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();
  const isColaborador = user?.rol === 'COLABORADOR';
  const isTecnico = user?.rol === 'TECNICO';
  const isAdmin = user?.rol === 'ADMINISTRADOR';

  useEffect(() => {
    const params = {};
    if (filtro !== "Todos") {
      const mapa = { 'Abierto': 'ABIERTO', 'En proceso': 'EN_PROCESO', 'Pendiente': 'PENDIENTE', 'Cerrado': 'CERRADO' };
      params.estado = mapa[filtro] || '';
    }
    Promise.all([
      getTickets(params),
      isAdmin ? getTicketsSlaVencidos().catch(() => []) : Promise.resolve([]),
    ]).then(([data, vencidos]) => {
      setTickets(data);
      setSlaVencidos(vencidos);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [filtro]);

  const filtros = isTecnico
    ? ["Todos", "Abierto", "En proceso", "Pendiente", "Cerrado"]
    : ["Todos", "Abierto", "En proceso", "Cerrado"];

  return (
    <div className="page-container fade-in">
      <div className="list-page-header">
        <div>
          <h1 className="page-title">{isTecnico ? "Tickets Asignados" : isAdmin ? "Todos los Tickets" : "Mis Tickets"}</h1>
          <p className="page-subtitle">Consulte el estado de los tickets</p>
        </div>
        {isColaborador && (
          <Link to="/tickets/nuevo" className="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo Requerimiento
          </Link>
        )}
      </div>

      {(isAdmin || isTecnico) && <SlaAlert count={slaVencidos.length} title="Alerta SLA" />}

      <div className="filter-row">
        {filtros.map((f) => (
          <button key={f} className={`filter-chip ${filtro === f ? "active" : ""}`}
            onClick={() => setFiltro(f)}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="empty-state"><p>Cargando tickets...</p></div>
      ) : tickets.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <h3>Sin tickets</h3>
          <p>No hay tickets en esta categoría.</p>
        </div>
      ) : (
        <div className="ticket-list">
          {tickets.map((t) => (
            <TicketCard key={t.id} ticket={t} />
          ))}
        </div>
      )}
    </div>
  );
}
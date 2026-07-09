import { useState, useEffect } from "react";
import { useNavigate } from "../utils/router";
import Breadcrumb from "../components/Breadcrumb";
import StatusBadge from "../components/StatusBadge";
import SlaAlert from "../components/SlaAlert";
import { getTickets, getTicketsSlaVencidos } from "../services/tickets.service";
import { getCurrentUser } from "../services/auth.service";
import { PRIORIDAD_ORDER, PRIORIDAD_CLASS, getPriorityColor } from "../utils/constants";
import "../styles/ListPage.css";

export default function BandejaTecnicoPage() {
  const [tickets, setTickets] = useState([]);
  const [slaVencidos, setSlaVencidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Todos");
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    Promise.all([
      getTickets(),
      getTicketsSlaVencidos().catch(() => []),
    ]).then(([data, vencidos]) => {
      const ordenados = data.sort((a, b) => {
        const pa = PRIORIDAD_ORDER[a.prioridad] ?? 3;
        const pb = PRIORIDAD_ORDER[b.prioridad] ?? 3;
        return pa - pb;
      });
      setTickets(ordenados);
      setSlaVencidos(vencidos);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtros = ["Todos", "Abierto", "En proceso", "Pendiente", "Cerrado"];
  const filtered = filtro === "Todos" ? tickets : tickets.filter((t) => t.estado === filtro);

  const pendientes = tickets.filter(t => t.estado_codigo !== 'CERRADO').length;
  const urgentes = tickets.filter(t => t.prioridad === 'Crítica' || t.prioridad === 'Alta').length;

  return (
    <div className="page-container fade-in">
      <Breadcrumb items={[{ label: "Bandeja" }]} />

      <div className="card-body-section" style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div className="avatar-circle avatar-circle-lg">
            {user?.nombre?.charAt(0) || "T"}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "1.25rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Técnico: <span style={{ color: "var(--color-primary)" }}>{user?.nombre || "Usuario"}</span>
            </h1>
            <p style={{ margin: "0.25rem 0 0", color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>
              {user?.especialidad ? `Especialidad: ${user.especialidad}` : "Soporte Técnico"}
            </p>
          </div>
        </div>

        <div className="minikpi-row3">
          <div className="minikpi minikpi-total">
            <div className="minikpi-val">{tickets.length}</div>
            <div className="minikpi-label">Total asignados</div>
          </div>
          <div className="minikpi minikpi-open">
            <div className="minikpi-val">{pendientes}</div>
            <div className="minikpi-label">Pendientes</div>
          </div>
          <div className="minikpi minikpi-urgent">
            <div className="minikpi-val">{urgentes}</div>
            <div className="minikpi-label">Urgentes</div>
          </div>
        </div>
      </div>

      <SlaAlert count={slaVencidos.length} />

      <div className="card-body-section">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 700, margin: 0 }}>Tickets Asignados</h2>
        </div>

        <div className="filter-row" style={{ marginBottom: "1rem" }}>
          {filtros.map((f) => (
            <button key={f} className={`filter-chip ${filtro === f ? "active" : ""}`}
              onClick={() => setFiltro(f)}>
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="empty-state"><p>Cargando tickets...</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <h3>Sin tickets</h3>
            <p>No hay tickets asignados en esta categoría.</p>
          </div>
        ) : (
          <div className="tickets-table-wrapper">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Prioridad</th>
                  <th>Estado</th>
                  <th>Usuario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}
                    style={t.estado_codigo !== 'CERRADO' && slaVencidos.some(s => s.id === t.id) ? { background: "#fef2f2" } : {}}
                    onClick={() => navigate(`/tickets/${t.id}`)}
                    className="clickable-row">
                    <td className="td-id">{t.id}</td>
                    <td><span style={{ fontWeight: 500 }}>{t.titulo}</span></td>
                    <td>
                      <span className={`badge ${t.tipo === 'Incidente' ? 'badge-tipo-incidente' : 'badge-tipo-requerimiento'}`}>
                        {t.tipo}
                      </span>
                    </td>
                    <td>{t.categoria_nombre}</td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <span className={`priority-dot ${PRIORIDAD_CLASS[t.prioridad] || "priority-baja"}`}></span>
                        <span style={{ color: getPriorityColor(t.prioridad), fontWeight: 600 }}>
                          {t.prioridad}
                        </span>
                      </span>
                    </td>
                    <td><StatusBadge estado={t.estado} /></td>
                    <td>{t.usuario_nombre}</td>
                    <td>
                      <button className="btn-ver-ticket" onClick={(e) => { e.stopPropagation(); navigate(`/tickets/${t.id}`); }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
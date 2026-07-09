import { useState, useEffect } from "react";
import { Link, useNavigate } from "../utils/router";
import SearchBar from "../components/SearchBar";
import StatusBadge from "../components/StatusBadge";
import { getTickets } from "../services/tickets.service";
import { getDashboardStats } from "../services/dashboard.service";
import { getCurrentUser } from "../services/auth.service";
import { Eye } from "lucide-react";
import heroBg from "../assets/bg-hero.avif";
import iconoRequerimiento from "../assets/Requerimiento.png";
import iconoIncidente from "../assets/Incidente.png";
import iconoConocimiento from "../assets/Conocimiento.png";
import "../styles/Dashboard.css";

export default function DashboardPage() {
  const [busqueda, setBusqueda] = useState("");
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const user = getCurrentUser();
  const navigate = useNavigate();

  const isColaborador = user?.rol === 'COLABORADOR';
  const isTecnico = user?.rol === 'TECNICO';
  const isAdmin = user?.rol === 'ADMINISTRADOR';

  useEffect(() => {
    getTickets().then((data) => setTickets(data.slice(0, 5))).catch(() => {});
    if (isAdmin || isTecnico) {
      getDashboardStats().then(setStats).catch(() => {});
    }
  }, []);

  const handleSearch = (value) => {
    if (!value.trim()) return;
    window.location.href = `/base-conocimiento?q=${encodeURIComponent(value)}`;
  };

  const mainCards = isColaborador ? [
    {
      to: "/tickets/nuevo",
      titulo: "Generar un Requerimiento",
      desc: "Consulte nuestro catálogo de servicios y genere su ticket",
      icono: <img src={iconoRequerimiento} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />,
      color: "#dbeafe",
      textColor: "#1d4ed8",
    },
    {
      to: "/incidentes",
      titulo: "Reportar un Incidente",
      desc: "Consulte nuestro catálogo de servicios y genere su ticket",
      icono: <img src={iconoIncidente} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />,
      color: "#fce4e4",
      textColor: "#dc2626",
    },
    {
      to: "/base-conocimiento",
      titulo: "Base de Conocimiento",
      desc: "Revise nuestras guías, instructivos, manuales y más",
      icono: <img src={iconoConocimiento} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />,
      color: "#d1fae5",
      textColor: "#16a34a",
    },
  ] : isTecnico ? [
    {
      to: "/bandeja",
      titulo: "Bandeja de Tickets",
      desc: "Vea sus tickets asignados ordenados por prioridad",
      icono: <img src={iconoRequerimiento} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />,
      color: "#dbeafe",
      textColor: "#1d4ed8",
    },
    {
      to: "/base-conocimiento",
      titulo: "Base de Conocimiento",
      desc: "Consulte la base de conocimiento técnica",
      icono: <img src={iconoConocimiento} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />,
      color: "#d1fae5",
      textColor: "#16a34a",
    },
  ] : [
    {
      to: "/admin-panel",
      titulo: "Panel de Administración",
      desc: "Monitoreo global del sistema",
      icono: <img src={iconoRequerimiento} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />,
      color: "#dbeafe",
      textColor: "#1d4ed8",
    },
    {
      to: "/admin/usuarios",
      titulo: "Gestión de Usuarios",
      desc: "Administre las cuentas del sistema",
      icono: <img src={iconoIncidente} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />,
      color: "#fce4e4",
      textColor: "#dc2626",
    },
    {
      to: "/reportes",
      titulo: "Reportes",
      desc: "Estadísticas y resumen de tickets",
      icono: <img src={iconoConocimiento} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />,
      color: "#d1fae5",
      textColor: "#16a34a",
    },
  ];

  return (
    <div className="dashboard-page fade-in">
      <section className="dashboard-hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-search-wrapper">
          <SearchBar
            value={busqueda}
            onChange={setBusqueda}
            onSubmit={handleSearch}
            placeholder="Busqueda"
            large
          />
        </div>
      </section>

      {(isAdmin || isTecnico) && stats && (
        <section style={{ padding: "1.5rem 2rem 0" }}>
          <div className="minikpi-row">
            <div className="minikpi minikpi-total">
              <div className="minikpi-val">{stats?.total_tickets || 0}</div>
              <div className="minikpi-label">Total Tickets</div>
            </div>
            <div className="minikpi minikpi-open">
              <div className="minikpi-val">{stats?.tickets_abiertos || 0}</div>
              <div className="minikpi-label">Abiertos</div>
            </div>
            <div className="minikpi minikpi-closed">
              <div className="minikpi-val">{stats?.tickets_cerrados || 0}</div>
              <div className="minikpi-label">Cerrados</div>
            </div>
          </div>
        </section>
      )}

      <section className="main-cards-row">
        {mainCards.map((card) => (
          <Link to={card.to} key={card.titulo} className="main-card">
            <div className="main-card-icon" style={{ backgroundColor: card.color, color: "white" }}>
              {card.icono}
            </div>
            <h3 className="main-card-title" style={{ color: card.textColor }}>{card.titulo}</h3>
            <p className="main-card-desc">{card.desc}</p>
          </Link>
        ))}
      </section>

      <section className="tickets-section">
        <div className="section-header">
          <h2 className="section-title">Tickets Recientes</h2>
          <Link to="/tickets" className="btn btn-ghost btn-sm">Ver todos</Link>
        </div>
        <div className="tickets-table-wrapper">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Detalle</th>
                <th>Especialidad</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} style={{ cursor: "pointer" }} onClick={() => navigate(`/tickets/${t.id}`)}>
                  <td className="td-id">{t.id}</td>
                  <td>{t.detalle}</td>
                  <td>{t.especialidad}</td>
                  <td>
                    <span className={`priority-dot priority-${t.prioridad?.toLowerCase()}`} />
                    {t.prioridad}
                  </td>
                  <td><StatusBadge estado={t.estado} /></td>
                  <td>
                    <button
                      className="btn-ver-ticket"
                      onClick={(e) => { e.stopPropagation(); navigate(`/tickets/${t.id}`); }}
                    >
                      <Eye size={14} />
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
              {tickets.length === 0 && (
                <tr><td colSpan="6" className="empty-cell">No hay tickets registrados</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
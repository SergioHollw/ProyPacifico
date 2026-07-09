import { useState, useEffect } from "react";
import { getDashboardStats } from "../services/dashboard.service";
import { getTicketsSlaVencidos } from "../services/tickets.service";
import SlaAlert from "../components/SlaAlert";
import EstadoChart from "../components/charts/EstadoChart";
import PrioridadChart from "../components/charts/PrioridadChart";
import { Ticket, Users, TriangleAlert, CircleCheckBig } from "lucide-react";
import "../styles/Dashboard.css";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [slaVencidos, setSlaVencidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getTicketsSlaVencidos().catch(() => [])])
      .then(([data, vencidos]) => {
        setStats(data);
        setSlaVencidos(vencidos);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-container fade-in">
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  const totalTecnicos = stats?.rendimiento_tecnicos?.length || 0;

  const porcentajeResueltos =
    stats?.total_tickets > 0
      ? Math.round((stats.tickets_cerrados / stats.total_tickets) * 100)
      : 0;

  return (
    <div className="dashboard-page fade-in">
      <div
        style={{ padding: "2rem 1.5rem", maxWidth: "1200px", margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Inicio</h1>
            <p
              style={{
                margin: "0.25rem 0 0",
                color: "var(--color-text-secondary)",
              }}
            >
              Panel de Administración
            </p>
          </div>
        </div>

        <SlaAlert count={slaVencidos.length} />

        <div className="dashboard-kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon blue">
              <Ticket />
            </div>

            <div className="kpi-info">
              <div className="kpi-title">Total Tickets</div>

              <div className="kpi-value">{stats?.total_tickets || 0}</div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon green">
              <Users />
            </div>

            <div className="kpi-info">
              <div className="kpi-title">Técnicos</div>

              <div className="kpi-value">{totalTecnicos}</div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon orange">
              <TriangleAlert />
            </div>

            <div className="kpi-info">
              <div className="kpi-title">SLA vencidos</div>

              <div className="kpi-value">{slaVencidos.length}</div>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon red">
              <CircleCheckBig />
            </div>

            <div className="kpi-info">
              <div className="kpi-title">Tickets Resueltos</div>

              <div className="kpi-value">{porcentajeResueltos}%</div>
            </div>
          </div>
        </div>

        <div className="chart-grid">
          <div className="card-body-section">
            <h3 style={{ marginBottom: "1rem" }}>Tickets por Estado</h3>
            <EstadoChart estados={stats?.tickets_por_estado} />
          </div>
          <div className="card-body-section">
            <h3 style={{ marginBottom: "1rem" }}>Tickets por Prioridad</h3>
            <PrioridadChart prioridades={stats?.tickets_por_prioridad} />
          </div>
        </div>

        <div className="card-body-section">
          <h3 style={{ margin: "0 0 0.75rem", fontSize: "1rem" }}>
            Rendimiento de Técnicos
          </h3>
          <div className="tickets-table-wrapper">
            <table className="tickets-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Especialidad</th>
                  <th>Disponible</th>
                  <th>Asignados</th>
                  <th>Resueltos</th>
                </tr>
              </thead>
              <tbody>
                {stats?.rendimiento_tecnicos?.map((t) => (
                  <tr key={t.id}>
                    <td>{t.nombre}</td>
                    <td>{t.especialidad}</td>
                    <td>{t.disponibilidad ? "Sí" : "No"}</td>
                    <td>{t.tickets_asignados}</td>
                    <td>{t.tickets_resueltos}</td>
                  </tr>
                ))}
                {(!stats?.rendimiento_tecnicos ||
                  stats.rendimiento_tecnicos.length === 0) && (
                  <tr>
                    <td colSpan="5" className="empty-cell">
                      Sin técnicos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

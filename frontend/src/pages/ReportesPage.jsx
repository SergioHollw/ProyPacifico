import { useState, useEffect } from "react";
import { getDashboardStats } from "../services/dashboard.service";
import {
  FileDown,
  FileText,
  Users,
  ClipboardList,
  TrendingUp,
} from "lucide-react";
import { exportCSV, exportPDF } from "../utils/reportExport";
import { getPriorityColor, getEstadoMeta } from "../utils/constants";
import "../styles/Reportes.css";

export default function ReportesPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-container fade-in">
        <p>Cargando reportes...</p>
      </div>
    );
  }

  const tieneDatos = (obj) => obj && Object.keys(obj).length > 0;
  const tieneTecnicos = stats?.rendimiento_tecnicos?.length > 0;
  const iniciales = (nombre = "") =>
    nombre
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("");

  const handleExportCSV = () => exportCSV(stats);
  const handleExportPDF = () => exportPDF(stats);

  return (
    <div className="page-container fade-in reportes-page">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <h1 className="page-title mb-1">Reportes</h1>
          <p className="page-subtitle mb-0">
            Estadísticas y resumen de tickets
          </p>
        </div>
        <div className="export-actions">
  <button
    type="button"
    className="export-btn export-btn-csv"
    onClick={handleExportCSV}
  >
    <FileDown size={17} />
    CSV
  </button>
  <button
    type="button"
    className="export-btn export-btn-pdf"
    onClick={handleExportPDF}
  >
    <FileText size={17} />
    PDF
  </button>
</div>
      </div>

      {/* KPIs superiores */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-3 mb-4">
        <div className="col">
          <div className="glow-card glow-card-primary h-100">
            <div className="glow-card-icon">
              <TrendingUp size={22} />
            </div>
            <div>
              <div className="glow-card-number">
                {stats?.total_tickets || 0}
              </div>
              <div className="glow-card-label">Total tickets</div>
            </div>
          </div>
        </div>

        {stats?.tickets_por_estado &&
          Object.entries(stats.tickets_por_estado).map(([estado, count]) => {
            const meta = getEstadoMeta(estado);
            return (
              <div className="col" key={estado}>
                <div className="stat-card h-100">
                  <div className="stat-card-number">{count}</div>
                  <span
                    className={`badge ${meta.badge} text-capitalize rounded-pill px-3 py-2`}
                  >
                    <span
                      className="d-inline-block rounded-circle me-2"
                      style={{
                        width: 6,
                        height: 6,
                        background: "currentColor",
                      }}
                    />
                    {estado.replace("_", " ")}
                  </span>
                </div>
              </div>
            );
          })}
      </div>

      {stats?.total_tickets === 0 && (
        <div className="empty-panel text-center py-5 mb-4">
          <ClipboardList size={48} className="text-secondary opacity-50 mb-3" />
          <h5 className="mb-1">Sin datos</h5>
          <p className="text-muted mb-0">
            Aún no hay tickets registrados en el sistema.
          </p>
        </div>
      )}

      {/* Tablas detalladas */}
      <div className="row row-cols-1 row-cols-lg-3 g-3">
        <div className="col">
          <div className="panel-card h-100">
            <h3 className="panel-title">Por prioridad</h3>
            {tieneDatos(stats?.tickets_por_prioridad) ? (
              <ul className="list-unstyled mb-0">
                {Object.entries(stats.tickets_por_prioridad).map(
                  ([prioridad, count]) => {
                    const max = Math.max(
                      ...Object.values(stats.tickets_por_prioridad),
                    );
                    const pct = max ? Math.round((count / max) * 100) : 0;
                    return (
                      <li key={prioridad} className="priority-row">
                        <div className="d-flex justify-content-between mb-1">
                          <span
                            className="text-capitalize fw-semibold"
                            style={{ color: getPriorityColor(prioridad) }}
                          >
                            {prioridad}
                          </span>
                          <span className="fw-bold">{count}</span>
                        </div>
                        <div className="priority-bar-track">
                          <div
                            className="priority-bar-fill"
                            style={{
                              width: `${pct}%`,
                              background: getPriorityColor(prioridad),
                            }}
                          />
                        </div>
                      </li>
                    );
                  },
                )}
              </ul>
            ) : (
              <p className="text-muted text-center small py-3 mb-0">
                Sin datos de prioridad
              </p>
            )}
          </div>
        </div>

        <div className="col">
          <div className="panel-card h-100">
            <h3 className="panel-title">Rendimiento Técnicos</h3>
            {tieneTecnicos ? (
              <ul className="list-unstyled mb-0">
                {stats.rendimiento_tecnicos.map((t) => {
                  const ratio =
                    t.tickets_asignados > 0
                      ? Math.round(
                          (t.tickets_resueltos / t.tickets_asignados) * 100,
                        )
                      : 0;
                  return (
                    <li key={t.id} className="tecnico-row">
                      <div className="tecnico-avatar">
                        {iniciales(t.nombre)}
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between">
                          <span className="fw-semibold">{t.nombre}</span>
                          <span className="small text-muted">
                            {t.tickets_resueltos}/{t.tickets_asignados}
                          </span>
                        </div>
                        <div className="priority-bar-track">
                          <div
                            className="priority-bar-fill"
                            style={{
                              width: `${ratio}%`,
                              background: "#16a34a",
                            }}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-4 text-muted">
                <Users size={36} className="opacity-50 mb-2" />
                <p className="small mb-0">Sin técnicos registrados</p>
              </div>
            )}
          </div>
        </div>

        <div className="col">
          <div className="panel-card h-100">
            <h3 className="panel-title">Resumen</h3>
            <ul className="list-unstyled mb-0">
              <li className="resumen-row">
                <span>Total tickets</span>
                <span className="fw-bold fs-6">
                  {stats?.total_tickets || 0}
                </span>
              </li>
              <li className="resumen-row">
                <span>Abiertos</span>
                <span className="fw-bold fs-6">
                  {stats?.tickets_abiertos || 0}
                </span>
              </li>
              <li className="resumen-row">
                <span>Cerrados</span>
                <span className="fw-bold fs-6">
                  {stats?.tickets_cerrados || 0}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

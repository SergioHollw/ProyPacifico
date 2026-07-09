export default function HistorialEstadosTable({ historial }) {
  return (
    <div className="card-body-section" style={{ marginTop: "1.5rem" }}>
      <h3 style={{ margin: "0 0 0.75rem", fontSize: "1rem" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6, verticalAlign: "middle" }}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        Historial de Estados
      </h3>
      {historial.length === 0 ? (
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem" }}>Sin cambios de estado registrados</p>
      ) : (
        <div className="tickets-table-wrapper">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>Anterior</th>
                <th>Nuevo</th>
                <th>Fecha</th>
                <th>Responsable</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((h, i) => (
                <tr key={i}>
                  <td>{h.estado_anterior || "—"}</td>
                  <td>{h.estado_nuevo}</td>
                  <td>{h.fecha_cambio ? new Date(h.fecha_cambio).toLocaleString("es-PE") : ""}</td>
                  <td>{h.usuario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

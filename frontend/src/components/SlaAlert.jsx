export default function SlaAlert({ count, title = "Alertas SLA", style }) {
  if (!count || count <= 0) return null;

  return (
    <div className="sla-alert sla-alert-danger" style={style}>
      <svg className="sla-alert-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div className="sla-alert-body">
        <div className="sla-alert-title">{title}</div>
        <div className="sla-alert-text">
          {count} ticket(s) han superado el tiempo de atención.
        </div>
      </div>
    </div>
  );
}

import { Link } from "../utils/router";

export default function NotFoundPage() {
  return (
    <div className="page-container fade-in" style={{ textAlign: "center", paddingTop: 80 }}>
      <div style={{ fontSize: 80, fontWeight: 800, color: "var(--color-primary)", lineHeight: 1, marginBottom: 16 }}>
        404
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Página no encontrada</h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: 24, fontSize: 14 }}>
        La página que buscas no existe o ha sido movida.
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        Volver al Inicio
      </Link>
    </div>
  );
}

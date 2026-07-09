import { Link } from "../utils/router";
import { formatDate } from "../utils/helpers";
import { getCategoryColor } from "../utils/constants";
import "../styles/KnowledgeCard.css";

export default function KnowledgeCard({ articulo }) {
  const catColor = getCategoryColor(articulo.categoria);

  return (
    <Link to={`/base-conocimiento/${articulo.id}`} className="knowledge-card">
      <div className="knowledge-card-icon" style={{ background: catColor.bg }}>{articulo.icono}</div>
      <div className="knowledge-card-body">
        <span className="knowledge-card-category" style={{ background: catColor.bg, color: catColor.text }}>
          {articulo.categoria}
        </span>
        <h3 className="knowledge-card-title">{articulo.titulo}</h3>
        <p className="knowledge-card-desc">{articulo.descripcion}</p>
        <div className="knowledge-card-meta">
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: "middle" }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            {articulo.autor}
          </span>
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: "middle" }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {formatDate(articulo.fecha)}
          </span>
        </div>
      </div>
    </Link>
  );
}
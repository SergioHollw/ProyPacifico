import { useState, useEffect } from "react";
import { useParams, Link } from "../utils/router";
import Breadcrumb from "../components/Breadcrumb";
import { getArticuloById } from "../services/knowledge.service";
import { formatDate } from "../utils/helpers";
import { getCategoryColor } from "../utils/constants";
import "../styles/BaseConocimiento.css";

export default function BaseConocimientoDetallePage() {
  const { id } = useParams();
  const [articulo, setArticulo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getArticuloById(id).then((data) => {
      setArticulo(data);
      setLoading(false);
      if (!data) setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="page-container fade-in">
        <div className="empty-state"><p>Cargando artículo...</p></div>
      </div>
    );
  }

  if (!articulo) {
    return (
      <div className="page-container fade-in">
        <div className="empty-state">
          <h3>Artículo no encontrado</h3>
          <p>El artículo que buscas no existe o ha sido eliminado.</p>
          <Link to="/base-conocimiento" className="btn btn-primary" style={{ marginTop: 16 }}>
            Volver a Base de Conocimiento
          </Link>
        </div>
      </div>
    );
  }

  const catColor = getCategoryColor(articulo.categoria);

  return (
    <div className="page-container fade-in">
      <Breadcrumb items={[
        { to: "/base-conocimiento", label: "Base de Conocimiento" },
        { label: articulo.titulo },
      ]} />

      <article className="article-detail">
        <div className="article-detail-header">
          <div className="article-detail-icon" style={{ background: catColor.bg }}>{articulo.icono}</div>
          <div>
            <span className="knowledge-card-category" style={{ marginBottom: 8, display: "inline-block", background: catColor.bg, color: catColor.text }}>
              {articulo.categoria}
            </span>
            <h1 className="article-detail-title">{articulo.titulo}</h1>
            <div className="article-detail-meta">
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: "middle" }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                {articulo.autor}
              </span>
              <span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: "middle" }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                {formatDate(articulo.fecha)}
              </span>
            </div>
          </div>
        </div>

        <div className="article-detail-description">
          <p>{articulo.descripcion}</p>
        </div>

        <div className="article-detail-content">
          {articulo.contenido.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        <div className="article-detail-actions">
          <Link to="/base-conocimiento" className="btn-volver-articulo">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Volver a Base de Conocimiento
          </Link>
        </div>
      </article>
    </div>
  );
}
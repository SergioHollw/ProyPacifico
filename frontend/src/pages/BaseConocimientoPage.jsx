import { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import KnowledgeCard from "../components/KnowledgeCard";
import { getArticulos, buscarArticulos, getCategorias } from "../services/knowledge.service";
import "../styles/BaseConocimiento.css";

export default function BaseConocimientoPage() {
  const [articulos, setArticulos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getArticulos(), getCategorias()]).then(([arts, cats]) => {
      setArticulos(arts);
      setCategorias(["Todas", ...cats]);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) {
      setBusqueda(q);
      buscarArticulos(q).then(setArticulos);
    }
  }, []);

  const handleSearch = (value) => {
    setBusqueda(value);
    if (value.trim()) {
      buscarArticulos(value).then(setArticulos);
    } else {
      getArticulos().then(setArticulos);
    }
  };

  const handleCategoryFilter = (cat) => {
    setCategoriaActiva(cat);
    if (cat === "Todas") {
      getArticulos().then(setArticulos);
    } else {
      getArticulos().then((arts) => setArticulos(arts.filter((a) => a.categoria === cat)));
    }
  };

  const getCategoryIcon = (cat) => {
    const icons = {
      Hardware: "💻",
      Software: "📦",
      Redes: "🌐",
    };
    return icons[cat] || "📄";
  };

  return (
    <div className="page-container fade-in">
      <div className="card-body-section" style={{ marginBottom: "1.5rem", background: "linear-gradient(135deg, var(--color-primary) 0%, #7c3aed 100%)", color: "#fff", border: "none" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Base de Conocimiento</h1>
        <p style={{ margin: "0.5rem 0 0", opacity: 0.9, fontSize: "0.875rem" }}>Encuentre guías, manuales y soluciones para resolver sus consultas</p>
        <div className="knowledge-search-wrapper" style={{ marginTop: "1rem", maxWidth: "500px" }}>
          <SearchBar
            value={busqueda}
            onChange={handleSearch}
            placeholder="Buscar en la base de conocimiento..."
          />
        </div>
      </div>

      <div className="knowledge-categories">
        {categorias.map((cat) => (
          <button
            key={cat}
            className={`category-chip ${categoriaActiva === cat ? "active" : ""}`}
            onClick={() => handleCategoryFilter(cat)}
          >
            {cat !== "Todas" && <span className="category-chip-icon">{getCategoryIcon(cat)}</span>}
            {cat}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)" }}>
          {loading ? "" : `${articulos.length} artículo(s) encontrado(s)`}
        </span>
      </div>

      {loading ? (
        <div className="empty-state"><p>Cargando artículos...</p></div>
      ) : articulos.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <h3>Sin resultados</h3>
          <p>No se encontraron artículos con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="knowledge-grid">
          {articulos.map((art) => (
            <KnowledgeCard key={art.id} articulo={art} />
          ))}
        </div>
      )}
    </div>
  );
}
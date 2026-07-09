import { useState } from "react";

export default function ComentariosSection({ comentarios, puedeComentar, ticketId, currentUserId, onComentar }) {
  const [nuevoComentario, setNuevoComentario] = useState("");

  const handleSubmit = async () => {
    if (!nuevoComentario.trim()) return;
    await onComentar(nuevoComentario);
    setNuevoComentario("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSubmit();
  };

  if (comentarios.length === 0 && !puedeComentar) return null;

  return (
    <div className="card-body-section" style={{ alignSelf: "stretch", display: "flex", flexDirection: "column" }}>
      <h3 style={{ margin: "0 0 0.75rem", fontSize: "1rem" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6, verticalAlign: "middle" }}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Comentarios ({comentarios.length})
      </h3>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem", maxHeight: "500px" }}>
        {comentarios.length === 0 ? (
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.875rem", textAlign: "center", padding: "2rem 0" }}>
            Sin comentarios aún
          </p>
        ) : (
          comentarios.map((c, i) => (
            <div key={c.id || i} style={{
              padding: "0.75rem", marginBottom: "0.5rem",
              background: c.persona === currentUserId ? "#dbeafe" : "#f9fafb",
              borderRadius: "0.5rem"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                <strong style={{ fontSize: "0.813rem" }}>{c.persona_nombre || "Usuario"}</strong>
                <small style={{ color: "var(--color-text-secondary)" }}>
                  {c.fecha_registro ? new Date(c.fecha_registro).toLocaleString("es-PE") : ""}
                </small>
              </div>
              <p style={{ margin: 0, fontSize: "0.875rem" }}>{c.mensaje}</p>
            </div>
          ))
        )}
      </div>

      {puedeComentar && (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input type="text" className="input" value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            placeholder="Escriba un comentario..." onKeyDown={handleKeyDown} />
          <button className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={!nuevoComentario.trim()}>
            Enviar
          </button>
        </div>
      )}
    </div>
  );
}

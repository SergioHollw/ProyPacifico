import { useState, useEffect } from "react";
import { useParams, Link } from "../utils/router";
import Breadcrumb from "../components/Breadcrumb";
import StatusBadge from "../components/StatusBadge";
import ComentariosSection from "../components/ComentariosSection";
import HistorialEstadosTable from "../components/HistorialEstadosTable";
import { getTicketById, getHistorialTicket, cambiarEstadoTicket, getTecnicosDisponibles, asignarTicket, getEstadosTicket } from "../services/tickets.service";
import { getComentarios, crearComentario } from "../services/comments.service";
import { getSoluciones, crearSolucion } from "../services/solutions.service";
import { getCurrentUser } from "../services/auth.service";
import { getPriorityColor } from "../utils/constants";
import "../styles/FormPage.css";
import "../styles/ListPage.css";

export default function TicketDetallePage() {
  const { id } = useParams();
  const user = getCurrentUser();
  const [ticket, setTicket] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [solucion, setSolucion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [solucionTexto, setSolucionTexto] = useState("");
  const [tecnicos, setTecnicos] = useState([]);
  const [tecnicoAsignar, setTecnicoAsignar] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [btnHover, setBtnHover] = useState(false);

  const isColaborador = user?.rol === 'COLABORADOR';
  const isTecnico = user?.rol === 'TECNICO';
  const isAdmin = user?.rol === 'ADMINISTRADOR';
  const estados = getEstadosTicket();

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");
      const t = await getTicketById(id);
      setTicket(t);
      const h = await getHistorialTicket(id);
      setHistorial(h);
      const c = await getComentarios(id);
      setComentarios(c);
      const s = await getSoluciones(id);
      if (s.length > 0) setSolucion(s[0]);
      if (isAdmin || isTecnico) {
        const tecs = await getTecnicosDisponibles(t.categoria_nombre);
        setTecnicos(tecs);
      }
    } catch (err) {
      const msg = (err.message || "").toLowerCase();
      if (msg.includes("not found") || msg.includes("no encontrado")) {
        if (isTecnico) {
          setError("No tienes acceso a este ticket. Solo puedes ver tickets asignados a ti.");
        } else if (isColaborador) {
          setError("Ticket no encontrado o no tienes permisos para verlo.");
        } else {
          setError("Ticket no encontrado.");
        }
      } else {
        setError("Error al cargar el ticket: " + (err.message || "desconocido"));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, [id]);

  const handleCambiarEstado = async (nuevoEstado) => {
    try {
      setError("");
      const result = await cambiarEstadoTicket(id, nuevoEstado);
      setTicket(result);
      const h = await getHistorialTicket(id);
      setHistorial(h);
      setSuccess(`Estado cambiado a ${nuevoEstado}`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleComentar = async (texto) => {
    if (!texto.trim()) return;
    try {
      setError("");
      await crearComentario(id, texto);
      const c = await getComentarios(id);
      setComentarios(c);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAsignar = async () => {
    if (!tecnicoAsignar) return;
    try {
      setError("");
      await asignarTicket(id, parseInt(tecnicoAsignar));
      setTecnicoAsignar("");
      const t = await getTicketById(id);
      setTicket(t);
      setSuccess("Ticket reasignado exitosamente");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCerrarConSolucion = async () => {
    if (!solucionTexto.trim()) return;
    try {
      setError("");
      await crearSolucion(id, solucionTexto);
      setSolucionTexto("");
      await cargarDatos();
      setSuccess("Ticket cerrado con solución registrada");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="page-container fade-in">
        <p>Cargando ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="page-container fade-in">
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <h2>Ticket no encontrado</h2>
          {isTecnico && (
            <p style={{ color: "var(--color-text-secondary)", margin: "8px 0 16px" }}>
              Solo puedes ver tickets que te han sido asignados.
            </p>
          )}
          <Link to="/tickets" className="btn btn-primary">Volver a tickets</Link>
        </div>
      </div>
    );
  }

  const puedeCambiarEstado = (isTecnico || isAdmin) && ticket.estado_codigo !== 'CERRADO';
  const puedeAsignar = isAdmin && ticket.estado_codigo !== 'CERRADO';
  const puedeComentar = !isColaborador || ticket.estado_codigo !== 'CERRADO';

  return (
    <div className="page-container fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <Breadcrumb items={[
          { to: "/tickets", label: "Tickets" },
          { label: `Ticket #${ticket.id}` },
        ]} />
        <Link to="/tickets" className="btn btn-outline"
          style={{
            borderRadius: "100px", padding: "0.375rem 1.25rem", fontWeight: 600, fontSize: "0.813rem",
            textDecoration: "none", flexShrink: 0,
            background: btnHover ? "var(--color-primary)" : "transparent",
            color: btnHover ? "#fff" : "var(--color-primary)",
            border: "1.5px solid var(--color-primary)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={() => setBtnHover(true)}
          onMouseLeave={() => setBtnHover(false)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 4, verticalAlign: "middle" }}><polyline points="15 18 9 12 15 6"/></svg>
          Volver
        </Link>
      </div>

      {error && <div className="sla-alert sla-alert-danger" style={{ padding: "0.75rem" }}>{error}</div>}
      {success && <div className="sla-alert" style={{ padding: "0.75rem", background: "#f0fdf4", borderColor: "#bbf7d0", color: "#16a34a" }}>{success}</div>}

      <div className="card-body-section" style={{ marginBottom: "1.5rem", background: "linear-gradient(135deg, #f8faff 0%, #fff 100%)", borderLeft: "4px solid var(--color-primary)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.25rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Ticket <span style={{ color: "var(--color-primary)" }}>#{ticket.id}</span>
            </h1>
            <p style={{ margin: "0.25rem 0 0", color: "var(--color-text-secondary)", fontWeight: 500 }}>{ticket.titulo}</p>
          </div>
          <StatusBadge estado={ticket.estado} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem 2rem" }}>
          <div><strong style={{ fontSize: "0.813rem", color: "var(--color-text-secondary)" }}>CATEGORÍA</strong><br />{ticket.categoria_nombre}</div>
          <div><strong style={{ fontSize: "0.813rem", color: "var(--color-text-secondary)" }}>PRIORIDAD</strong><br /><span style={{ color: getPriorityColor(ticket.prioridad), fontWeight: 600 }}>{ticket.prioridad}</span></div>
          <div><strong style={{ fontSize: "0.813rem", color: "var(--color-text-secondary)" }}>CREADO POR</strong><br />{ticket.usuario_nombre}</div>
          <div><strong style={{ fontSize: "0.813rem", color: "var(--color-text-secondary)" }}>FECHA</strong><br />{ticket.fecha_registro ? new Date(ticket.fecha_registro).toLocaleString("es-PE") : ""}</div>
          {ticket.fecha_cierre && (
            <div><strong style={{ fontSize: "0.813rem", color: "var(--color-text-secondary)" }}>FECHA CIERRE</strong><br />{new Date(ticket.fecha_cierre).toLocaleString("es-PE")}</div>
          )}
        </div>

        {ticket.tecnico_nombre ? (
          <div className="tec-info-card">
            <div className="tec-info-avatar">{ticket.tecnico_nombre.charAt(0)}</div>
            <div>
              <div className="tec-info-name">{ticket.tecnico_nombre}</div>
              <div className="tec-info-spec">Técnico asignado</div>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "12px", padding: "8px 12px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "0.5rem", fontSize: "0.875rem", color: "#92400e" }}>
            <strong>Pendiente de asignación</strong>
          </div>
        )}

        {ticket.descripcion && (
          <div style={{ marginTop: "1rem", padding: "1rem", background: "#f9fafb", borderRadius: "0.5rem" }}>
            <strong style={{ fontSize: "0.813rem", color: "var(--color-text-secondary)" }}>DESCRIPCIÓN</strong>
            <p style={{ margin: "0.5rem 0 0", whiteSpace: "pre-wrap", color: "var(--color-text)" }}>{ticket.descripcion}</p>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: (puedeAsignar || puedeCambiarEstado || (isTecnico && ticket.estado_codigo !== 'CERRADO') || solucion) && (comentarios.length > 0 || puedeComentar) ? "1fr 1fr" : "1fr", gap: "1.5rem" }}>
        {(puedeAsignar || puedeCambiarEstado || (isTecnico && ticket.estado_codigo !== 'CERRADO') || solucion) && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {puedeAsignar && (
              <div className="card-body-section">
                <h3 style={{ margin: "0 0 0.75rem", fontSize: "1rem" }}>Reasignar Ticket</h3>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}>
                    <select className="select" value={tecnicoAsignar} onChange={(e) => setTecnicoAsignar(e.target.value)}>
                      <option value="">Seleccione técnico...</option>
                      {tecnicos.map((t) => (
                        <option key={t.id} value={t.id}>{t.nombre} - {t.especialidad}</option>
                      ))}
                    </select>
                  </div>
                  <button className="btn btn-primary" onClick={handleAsignar} disabled={!tecnicoAsignar}>Asignar</button>
                </div>
              </div>
            )}
            {puedeCambiarEstado && (
              <div className="card-body-section">
                <h3 style={{ margin: "0 0 0.75rem", fontSize: "1rem" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6, verticalAlign: "middle" }}><path d="M16 3h5v5M8 3H3v5"/><path d="M3 14v3a2 2 0 0 0 2 2h3"/><path d="M21 14v3a2 2 0 0 1-2 2h-3"/></svg>
                  Cambiar Estado
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                  {estados.filter(e => e.codigo !== ticket.estado_codigo).map((est) => (
                    <button key={est.codigo} className="btn btn-sm btn-outline" onClick={() => handleCambiarEstado(est.nombre)}>
                      {est.nombre}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isTecnico && ticket.estado_codigo !== 'CERRADO' && (
              <div className="card-body-section">
                <h3 style={{ margin: "0 0 0.75rem", fontSize: "1rem" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6, verticalAlign: "middle" }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Cerrar con Solución
                </h3>
                <textarea className="textarea" rows={4} value={solucionTexto}
                  onChange={(e) => setSolucionTexto(e.target.value)}
                  placeholder="Describa la solución aplicada..."
                  style={{ marginBottom: "0.5rem", resize: "none", height: "100px" }} />
                <button className="btn btn-primary" onClick={handleCerrarConSolucion} disabled={!solucionTexto.trim()}>
                  Cerrar Ticket
                </button>
              </div>
            )}

            {solucion && (
              <div className="card-body-section" style={{ borderColor: "#bbf7d0", background: "#f0fdf4" }}>
                <h3 style={{ margin: "0 0 0.5rem", color: "#16a34a", fontSize: "1rem" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 6, verticalAlign: "middle" }}><polyline points="20 6 9 17 4 12"/></svg>
                  Solución
                </h3>
                <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{solucion.descripcion}</p>
                <small style={{ color: "var(--color-text-secondary)", marginTop: "0.5rem", display: "block" }}>
                  {solucion.tecnico_nombre} - {solucion.fecha_registro ? new Date(solucion.fecha_registro).toLocaleString("es-PE") : ""}
                </small>
              </div>
            )}
          </div>
        )}

        <ComentariosSection
          comentarios={comentarios}
          puedeComentar={puedeComentar}
          ticketId={id}
          currentUserId={user?.id}
          onComentar={handleComentar}
        />
      </div>

      <HistorialEstadosTable historial={historial} />
    </div>
  );
}
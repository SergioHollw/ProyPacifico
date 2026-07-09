import { useState, useEffect } from "react";
import { useNavigate } from "../utils/router";
import FileUpload from "../components/FileUpload";
import { crearTicket, getCategorias } from "../services/tickets.service";
import { getPriorityColor } from "../utils/constants";
import "../styles/FormPage.css";

const PASOS = [
  { num: 1, label: "Categoría y Servicio" },
  { num: 2, label: "Detalle del requerimiento" },
  { num: 3, label: "Revisión y envío" },
];

export default function RequerimientoNuevoPage() {
  const navigate = useNavigate();
  const [paso, setPaso] = useState(1);
  const [enviado, setEnviado] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [errores, setErrores] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    categoria: "",
    subcategoria: "",
    servicio: "",
    asunto: "",
    descripcion: "",
    prioridad: "Media",
  });

  useEffect(() => {
    getCategorias().then((data) => setCategorias(data));
  }, []);

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: null }));
  };

  const validarPaso = () => {
    const errs = {};
    if (paso === 1) {
      if (!form.categoria) errs.categoria = "Seleccione una categoría";
      if (!form.servicio) errs.servicio = "Seleccione un servicio";
    } else if (paso === 2) {
      if (!form.asunto.trim()) errs.asunto = "El asunto es obligatorio";
      if (!form.descripcion.trim()) errs.descripcion = "La descripción es obligatoria";
    }
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const siguiente = () => {
    if (validarPaso()) setPaso((p) => Math.min(p + 1, 3));
  };

  const anterior = () => setPaso((p) => Math.max(p - 1, 1));

  const handleSubmit = async () => {
    if (!validarPaso()) return;
    const result = await crearTicket({
      tipo: "Requerimiento",
      detalle: form.asunto,
      especialidad: form.categoria,
      prioridad: form.prioridad,
      ...form,
    }, archivo);
    setTicketId(result.id);
    setEnviado(true);
  };

  if (enviado) {
    return (
      <div className="page-container fade-in">
        <div className="success-card">
          <div className="success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="success-title">{ticketId}</h2>
          <p className="success-desc">Requerimiento generado correctamente.</p>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate("/tickets")}>
              Mis Tickets
            </button>
            <button className="btn btn-secondary" onClick={() => {
              setEnviado(false);
              setPaso(1);
              setForm({ categoria: "", subcategoria: "", servicio: "", asunto: "", descripcion: "", prioridad: "Media" });
              setArchivo(null);
            }}>
              Nuevo requerimiento
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="form-page-header">
        <h1 className="page-title">Generar Requerimiento</h1>
        <p className="page-subtitle">Solicite un servicio del catálogo corporativo</p>
      </div>

      <div className="pasos-indicator">
        {PASOS.map((p, i) => (
          <div key={p.num} className="paso-item">
            <div className={`paso-circle ${paso === p.num ? "paso-active" : paso > p.num ? "paso-done" : ""}`}>
              {paso > p.num ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                p.num
              )}
            </div>
            <span className={`paso-label ${paso === p.num ? "paso-label-active" : ""}`}>{p.label}</span>
            {i < PASOS.length - 1 && <div className="paso-line" />}
          </div>
        ))}
      </div>

      <div className="form-card">
        {paso === 1 && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>* Categoría</label>
                <select className={`select ${errores.categoria ? "input-error" : ""}`}
                  value={form.categoria} onChange={(e) => handleChange("categoria", e.target.value)}>
                  <option value="">Seleccione...</option>
                  {categorias.map((c) => (
                    <option key={c.id || c.nombre} value={c.nombre || c}>{c.nombre || c}</option>
                  ))}
                </select>
                {errores.categoria && <span className="error-text">{errores.categoria}</span>}
              </div>
              <div className="form-group">
                <label>Subcategoría</label>
                <select className="select" value={form.subcategoria}
                  onChange={(e) => handleChange("subcategoria", e.target.value)}>
                  <option value="">Seleccione...</option>
                  <option value="Instalación">Instalación</option>
                  <option value="Configuración">Configuración</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Soporte">Soporte</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>* Servicio</label>
              <select className={`select ${errores.servicio ? "input-error" : ""}`}
                value={form.servicio} onChange={(e) => handleChange("servicio", e.target.value)}>
                <option value="">Seleccione...</option>
                <option value="Correo electrónico">Correo electrónico</option>
                <option value="Red / Internet">Red / Internet</option>
                <option value="Equipo de cómputo">Equipo de cómputo</option>
                <option value="Aplicativo / Sistema">Aplicativo / Sistema</option>
                <option value="Accesos">Accesos</option>
              </select>
              {errores.servicio && <span className="error-text">{errores.servicio}</span>}
            </div>
            <div className="form-group">
              <label>* Prioridad</label>
              <div className="prioridad-opciones">
                {["Baja", "Media", "Alta", "Crítica"].map((p) => (
                  <button key={p} type="button"
                    className={`prioridad-btn ${form.prioridad === p ? "prioridad-btn-selected" : ""}`}
                    style={form.prioridad === p ? { borderColor: getPriorityColor(p), background: `${getPriorityColor(p)}15`, color: getPriorityColor(p) } : {}}
                    onClick={() => handleChange("prioridad", p)}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {paso === 2 && (
          <>
            <div className="form-group">
              <label>* Asunto</label>
              <input type="text" className={`input ${errores.asunto ? "input-error" : ""}`}
                value={form.asunto} onChange={(e) => handleChange("asunto", e.target.value)}
                placeholder="Ej: Instalación de Office 365" />
              {errores.asunto && <span className="error-text">{errores.asunto}</span>}
            </div>
            <div className="form-group">
              <label>* Descripción</label>
              <textarea className={`textarea ${errores.descripcion ? "input-error" : ""}`}
                rows={6} value={form.descripcion}
                onChange={(e) => handleChange("descripcion", e.target.value)}
                placeholder="Describa el requerimiento con detalle. Incluya información relevante como equipos involucrados, fechas, etc." />
              {errores.descripcion && <span className="error-text">{errores.descripcion}</span>}
            </div>
            <FileUpload file={archivo} onFileChange={setArchivo} inputId="file-input-nuevo" />
          </>
        )}

        {paso === 3 && (
          <div className="form-preview">
            <h3 className="form-preview-title">Revise los datos antes de enviar</h3>
            <table className="form-preview-table">
              <tbody>
                <tr><td>Categoría</td><td>{form.categoria}</td></tr>
                <tr><td>Subcategoría</td><td>{form.subcategoria || "—"}</td></tr>
                <tr><td>Servicio</td><td>{form.servicio}</td></tr>
                <tr><td>Prioridad</td><td><span style={{ color: getPriorityColor(form.prioridad), fontWeight: 600 }}>{form.prioridad}</span></td></tr>
                <tr><td>Asunto</td><td>{form.asunto}</td></tr>
                <tr><td>Descripción</td><td style={{ whiteSpace: "pre-wrap" }}>{form.descripcion}</td></tr>
                <tr><td>Archivo</td><td>{archivo ? archivo.name : "—"}</td></tr>
              </tbody>
            </table>

            <div className="form-preview-notice">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <span>Una vez enviado, podrá dar seguimiento al requerimiento desde "Mis Tickets".</span>
            </div>
          </div>
        )}

        <div className="form-actions form-actions-between">
          {paso > 1 ? (
            <button type="button" className="btn btn-ghost" onClick={anterior}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              Anterior
            </button>
          ) : <div />}
          {paso < 3 ? (
            <button type="button" className="btn btn-primary btn-lg" onClick={siguiente}>
              Siguiente
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          ) : (
            <button type="button" className="btn btn-primary btn-lg" onClick={handleSubmit}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4z"/></svg>
              Enviar Requerimiento
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

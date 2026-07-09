import { useState, useEffect } from "react";
import { useNavigate } from "../utils/router";
import FileUpload from "../components/FileUpload";
import { crearTicket, getCategorias } from "../services/tickets.service";
import { getCurrentUser } from "../services/auth.service";
import "../styles/FormPage.css";

export default function IncidentesPage() {
  const navigate = useNavigate();
  const [enviado, setEnviado] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [errores, setErrores] = useState({});
  const currentUser = getCurrentUser();
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({
    esParaOtraPersona: "No",
    solicitadoPor: currentUser?.nombre || "Usuario",
    breveDescripcion: "",
    descripcion: "",
    servicio: "",
    categoria: "",
  });

  useEffect(() => {
    getCategorias().then((data) => setCategorias(data));
  }, []);

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: null }));
  };

  const validar = () => {
    const errs = {};
    if (!form.breveDescripcion.trim()) errs.breveDescripcion = "Campo obligatorio";
    if (!form.descripcion.trim()) errs.descripcion = "Campo obligatorio";
    if (!form.servicio) errs.servicio = "Seleccione un servicio";
    if (!form.categoria) errs.categoria = "Seleccione una categoría";
    setErrores(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    const result = await crearTicket({
      tipo: "Incidente",
      detalle: form.breveDescripcion,
      especialidad: form.categoria,
      prioridad: "Media",
      servicio: form.servicio,
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
          <p className="success-desc">Incidente registrado correctamente.</p>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate("/dashboard")}>
              Ir al Dashboard
            </button>
            <button className="btn btn-secondary" onClick={() => {
              setEnviado(false);
              setForm({ esParaOtraPersona: "No", solicitadoPor: "Dante Elescano Alvarado", breveDescripcion: "", descripcion: "", servicio: "", categoria: "" });
              setArchivo(null);
            }}>
              Reportar otro incidente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container fade-in">
      <div className="form-page-header">
        <h1 className="page-title">Reportar un Incidente</h1>
        <p className="page-subtitle">Reporte una falla o problema técnico para recibir asistencia</p>
      </div>

      <div className="form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>¿El incidente lo presenta otra persona?</label>
            <select className="select" value={form.esParaOtraPersona}
              onChange={(e) => handleChange("esParaOtraPersona", e.target.value)}>
              <option value="No">No</option>
              <option value="Sí">Sí</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>* Breve descripción</label>
              <input type="text" className={`input ${errores.breveDescripcion ? "input-error" : ""}`}
                value={form.breveDescripcion}
                onChange={(e) => handleChange("breveDescripcion", e.target.value)}
                placeholder="Ej: No puedo acceder a mi correo" />
              {errores.breveDescripcion && <span className="error-text">{errores.breveDescripcion}</span>}
            </div>
            <div className="form-group">
              <label>Solicitado por</label>
              <input type="text" className="input" value={form.solicitadoPor} disabled />
            </div>
          </div>

          <div className="form-group">
            <label>* Descripción</label>
            <textarea className={`textarea ${errores.descripcion ? "input-error" : ""}`}
              rows={5} value={form.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              placeholder="Describa el incidente con detalle..." />
            {errores.descripcion && <span className="error-text">{errores.descripcion}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>* Servicio</label>
              <select className={`select ${errores.servicio ? "input-error" : ""}`}
                value={form.servicio} onChange={(e) => handleChange("servicio", e.target.value)}>
                <option value="">Seleccione...</option>
                <option value="Correo electrónico">Correo electrónico</option>
                <option value="Red / Internet">Red / Internet</option>
                <option value="Equipo de cómputo">Equipo de cómputo</option>
                <option value="Aplicativo / Sistema">Aplicativo / Sistema</option>
              </select>
              {errores.servicio && <span className="error-text">{errores.servicio}</span>}
            </div>
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
          </div>

          <FileUpload file={archivo} onFileChange={setArchivo} inputId="file-incidente" />

          <div className="form-actions">
            <button type="submit" className="btn btn-danger btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13"/><path d="M22 2L15 22l-4-9-9-4z"/>
              </svg>
              Reportar Incidente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

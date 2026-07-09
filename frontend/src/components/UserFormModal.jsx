import Modal from "./Modal";

const ROLES = ["COLABORADOR", "TECNICO", "ADMINISTRADOR"];

export default function UserFormModal({ isOpen, onClose, editingUser, form, onChange, onSubmit, error }) {
  const handleChange = (campo, valor) => onChange(campo, valor);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingUser ? "Editar Usuario" : "Crear Usuario"}
      footer={
        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" form="userForm">Guardar</button>
        </div>
      }
    >
      <form id="userForm" onSubmit={onSubmit}>
        {editingUser ? (
          <>
            <div className="form-group">
              <label>Nombre</label>
              <input className="input" value={form.nombre} onChange={(e) => handleChange("nombre", e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Correo</label>
              <input className="input" value={form.correo} disabled />
            </div>
            <div className="form-group">
              <label>Rol</label>
              <input className="input" value={form.rol} disabled />
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label>Nombre completo</label>
              <input className="input" value={form.nombre} onChange={(e) => handleChange("nombre", e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Correo corporativo</label>
              <input className="input" type="email" value={form.correo} onChange={(e) => handleChange("correo", e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Contraseña</label>
              <input className="input" type="password" value={form.password} onChange={(e) => handleChange("password", e.target.value)} required minLength={6} />
            </div>
            <div className="form-group">
              <label>Rol</label>
              <select className="select" value={form.rol} onChange={(e) => handleChange("rol", e.target.value)}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            {form.rol === "COLABORADOR" && (
              <div className="form-group">
                <label>Área</label>
                <input className="input" value={form.area} onChange={(e) => handleChange("area", e.target.value)} />
              </div>
            )}
            {form.rol === "TECNICO" && (
              <div className="form-group">
                <label>Especialidad</label>
                <select className="select" value={form.especialidad} onChange={(e) => handleChange("especialidad", e.target.value)}>
                  <option value="">Seleccione...</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Redes">Redes</option>
                </select>
              </div>
            )}
            {form.rol === "ADMINISTRADOR" && (
              <div className="form-group">
                <label>Nivel de acceso</label>
                <input className="input" value={form.nivel_acceso} onChange={(e) => handleChange("nivel_acceso", e.target.value)} />
              </div>
            )}
          </>
        )}
      </form>
    </Modal>
  );
}

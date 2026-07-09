import { useState, useEffect } from "react";
import UserFormModal from "../components/UserFormModal";
import api from "../services/http.service";
import "../styles/ListPage.css";

export default function AdminUsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "", correo: "", password: "", rol: "COLABORADOR",
    area: "", especialidad: "", nivel_acceso: "",
  });

  const cargarUsuarios = async () => {
    try {
      const data = await api.get('/usuarios/');
      setUsuarios(data || []);
    } catch (err) {
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const handleChange = (campo, valor) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const abrirCrear = () => {
    setEditingUser(null);
    setForm({ nombre: "", correo: "", password: "", rol: "COLABORADOR", area: "", especialidad: "", nivel_acceso: "" });
    setError("");
    setShowModal(true);
  };

  const abrirEditar = (user) => {
    setEditingUser(user);
    setForm({
      nombre: user.nombre, correo: user.correo, password: "",
      rol: user.rol, area: user.area || "",
      especialidad: user.especialidad || "",
      nivel_acceso: user.nivel_acceso || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editingUser) {
        await api.patch(`/usuarios/${editingUser.id}/`, { nombre: form.nombre });
      } else {
        await api.post('/auth/register/', form);
      }
      setShowModal(false);
      await cargarUsuarios();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleEstado = async (user) => {
    try {
      await api.patch(`/usuarios/${user.id}/cambiar-estado/`);
      await cargarUsuarios();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="list-page-header">
        <div>
          <h1 className="page-title">Gestión de Usuarios</h1>
          <p className="page-subtitle">Administre las cuentas del sistema</p>
        </div>
        <button className="btn btn-primary" onClick={abrirCrear}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo Usuario
        </button>
      </div>

      {error && <div className="sla-alert sla-alert-danger" style={{ padding: "0.75rem" }}>{error}</div>}

      {loading ? (
        <div className="empty-state"><p>Cargando usuarios...</p></div>
      ) : usuarios.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <h3>Sin usuarios</h3>
        </div>
      ) : (
        <div className="tickets-table-wrapper">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha Creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td className="td-id">{u.id}</td>
                  <td><strong>{u.nombre}</strong></td>
                  <td>{u.correo}</td>
                  <td>
                    <span className={`badge ${u.rol === 'ADMINISTRADOR' ? 'badge-open' : u.rol === 'TECNICO' ? 'badge-in-progress' : 'badge-closed'}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td>{u.activo ? "Activo" : "Inactivo"}</td>
                  <td>{u.fecha_creacion ? new Date(u.fecha_creacion).toLocaleDateString("es-PE") : ""}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.375rem" }}>
                      <button className="btn btn-primary btn-sm" onClick={() => abrirEditar(u)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Editar
                      </button>
                      <button className={`btn btn-sm ${u.activo ? 'btn-danger' : 'btn-secondary'}`} onClick={() => handleToggleEstado(u)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          {u.activo
                            ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                            : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                          }
                        </svg>
                        {u.activo ? "Desactivar" : "Activar"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <UserFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        editingUser={editingUser}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
        error={error}
      />
    </div>
  );
}
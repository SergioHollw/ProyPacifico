import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "../utils/router";
import { getCurrentUser } from "../services/auth.service";
import { contarNoLeidas } from "../services/notifications.service";
import Modal from "./Modal";
import NotificacionesDropdown from "./NotificacionesDropdown";
import "../styles/Navbar.css";
import logoSrc from "../assets/logo-pacifico.png";

export default function Navbar({ onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const user = getCurrentUser();
  const navigate = useNavigate();
  const notifRef = useRef(null);

  useEffect(() => {
    contarNoLeidas().then(setNotifCount).catch(() => {});
    const interval = setInterval(() => {
      contarNoLeidas().then(setNotifCount).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const rol = user?.rol;

  const links = [];
  if (rol === 'COLABORADOR') {
    links.push(
      { to: "/dashboard", label: "Inicio" },
      { to: "/tickets", label: "Mis Tickets" },
      { to: "/tickets/nuevo", label: "Generar Requerimiento" },
      { to: "/base-conocimiento", label: "Base de Conocimiento", activeOnPaths: ["/base-conocimiento"] },
      { to: "/incidentes", label: "Reportar Incidente" },
    );
  } else if (rol === 'TECNICO') {
    links.push(
      { to: "/bandeja", label: "Bandeja" },
      { to: "/tickets", label: "Tickets Asignados" },
      { to: "/base-conocimiento", label: "Base de Conocimiento", activeOnPaths: ["/base-conocimiento"] },
    );
  } else if (rol === 'ADMINISTRADOR') {
    links.push(
      { to: "/admin-panel", label: "Inicio" },
      { to: "/tickets", label: "Tickets" },
      { to: "/admin/usuarios", label: "Usuarios" },
      { to: "/reportes", label: "Reportes" },
      { to: "/base-conocimiento", label: "Base de Conocimiento", activeOnPaths: ["/base-conocimiento"] },
    );
  }

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    if (onLogout) onLogout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <nav className="navbar-top">
        <div className="navbar-inner">
          <NavLink to={rol === 'TECNICO' ? '/bandeja' : rol === 'ADMINISTRADOR' ? '/admin-panel' : '/dashboard'} className="navbar-brand">
            <div className="navbar-logo">
              <img src={logoSrc} alt="Pacífico Seguros" height="40" style={{ objectFit: "contain" }} />
            </div>
          </NavLink>

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
            <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
            <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
            <span className={`hamburger-line ${menuOpen ? "open" : ""}`}></span>
          </button>

          <div className="navbar-right">
            <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  activeOnPaths={link.activeOnPaths}
                  className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
            <div ref={notifRef} style={{ position: "relative" }}>
              <button className="nav-icon-btn" title="Notificaciones" onClick={() => setNotifOpen(!notifOpen)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {notifCount > 0 && <span className="notif-badge">{notifCount}</span>}
              </button>
              {notifOpen && <NotificacionesDropdown onClose={() => setNotifOpen(false)} setNotifCount={setNotifCount} />}
            </div>

            <div className="user-menu-container">
              <button className="user-avatar-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <div className="user-avatar">
                  {user?.nombre?.charAt(0) || "U"}
                </div>
                <span className="user-name">{user?.nombre?.split(" ")[0] || "Usuario"}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {userMenuOpen && (
                <>
                  <div className="user-menu-backdrop" onClick={() => setUserMenuOpen(false)} />
                  <div className="user-menu">
                    <div className="user-menu-header">
                      <div className="user-avatar lg">{user?.nombre?.charAt(0) || "U"}</div>
                      <div>
                        <div className="user-menu-name">{user?.nombre || "Usuario"}</div>
                        <div className="user-menu-email">{user?.email || ""}</div>
                      </div>
                    </div>
                    <div className="user-menu-divider" />
                    <button className="user-menu-item" onClick={() => { setUserMenuOpen(false); navigate("/perfil"); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                      Mi perfil
                    </button>
                    <button className="user-menu-item" onClick={() => { setUserMenuOpen(false); navigate("/configuracion"); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                      Configuración
                    </button>
                    <div className="user-menu-divider" />
                    <button className="user-menu-item danger" onClick={() => { setUserMenuOpen(false); setShowLogoutModal(true); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                      Cerrar sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Cerrar sesión"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowLogoutModal(false)}>Cancelar</button>
            <button className="btn btn-danger" onClick={handleLogoutConfirm}>Cerrar sesión</button>
          </>
        }
      >
        <p>¿Desea cerrar sesión?</p>
      </Modal>
    </>
  );
}
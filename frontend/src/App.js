import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "./utils/router";
import { isAuthenticated, getCurrentUser, logout as doLogout } from "./services/auth.service";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BaseConocimientoPage from "./pages/BaseConocimientoPage";
import BaseConocimientoDetallePage from "./pages/BaseConocimientoDetallePage";
import TicketsPage from "./pages/TicketsPage";
import TicketNuevoPage from "./pages/TicketNuevoPage";
import IncidentesPage from "./pages/IncidentesPage";
import PerfilPage from "./pages/PerfilPage";
import ConfiguracionPage from "./pages/ConfiguracionPage";
import NotFoundPage from "./pages/NotFoundPage";
import ReportesPage from "./pages/ReportesPage";
import BandejaTecnicoPage from "./pages/BandejaTecnicoPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsuariosPage from "./pages/AdminUsuariosPage";
import TicketDetallePage from "./pages/TicketDetallePage";
import "./styles/global.css";

const HOME_ROUTES = {
  COLABORADOR: "/dashboard",
  TECNICO: "/bandeja",
  ADMINISTRADOR: "/admin-panel",
};
const getHomeRoute = () => HOME_ROUTES[getCurrentUser()?.rol] || "/dashboard";

function ProtectedRoute({ children, allowedRoles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles) {
    const user = getCurrentUser();
    if (!user || !allowedRoles.includes(user.rol)) {
      return <Navigate to={getHomeRoute()} replace />;
    }
  }
  return children;
}

function HomeRedirect() {
  return <Navigate to={getHomeRoute()} replace />;
}

function RoleRoute({ children, roles }) {
  return <ProtectedRoute allowedRoles={roles}>{children}</ProtectedRoute>;
}

function AppLayout({ children }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    doLogout();
    navigate("/login", { replace: true });
  };
  return <Layout onLogout={handleLogout}>{children}</Layout>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout><DashboardPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/base-conocimiento" element={
          <ProtectedRoute>
            <AppLayout><BaseConocimientoPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/base-conocimiento/:id" element={
          <ProtectedRoute>
            <AppLayout><BaseConocimientoDetallePage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/tickets" element={
          <ProtectedRoute>
            <AppLayout><TicketsPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/tickets/nuevo" element={
          <RoleRoute roles={['COLABORADOR']}>
            <AppLayout><TicketNuevoPage /></AppLayout>
          </RoleRoute>
        } />
        <Route path="/incidentes" element={
          <RoleRoute roles={['COLABORADOR']}>
            <AppLayout><IncidentesPage /></AppLayout>
          </RoleRoute>
        } />
        <Route path="/tickets/:id" element={
          <ProtectedRoute>
            <AppLayout><TicketDetallePage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/bandeja" element={
          <RoleRoute roles={['TECNICO']}>
            <AppLayout><BandejaTecnicoPage /></AppLayout>
          </RoleRoute>
        } />
        <Route path="/admin-panel" element={
          <RoleRoute roles={['ADMINISTRADOR']}>
            <AppLayout><AdminDashboardPage /></AppLayout>
          </RoleRoute>
        } />
        <Route path="/admin/usuarios" element={
          <RoleRoute roles={['ADMINISTRADOR']}>
            <AppLayout><AdminUsuariosPage /></AppLayout>
          </RoleRoute>
        } />
        <Route path="/reportes" element={
          <RoleRoute roles={['ADMINISTRADOR']}>
            <AppLayout><ReportesPage /></AppLayout>
          </RoleRoute>
        } />
        <Route path="/perfil" element={
          <ProtectedRoute>
            <AppLayout><PerfilPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/configuracion" element={
          <ProtectedRoute>
            <AppLayout><ConfiguracionPage /></AppLayout>
          </ProtectedRoute>
        } />
        <Route element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout.jsx";
import PublicLayout from "../layouts/PublicLayout.jsx";
import ProtectedRoute from "../components/admin/ProtectedRoute.jsx";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage.jsx";
import AdminLoginPage from "../pages/admin/AdminLoginPage.jsx";
import AdminProjectsPage from "../pages/admin/AdminProjectsPage.jsx";
import AdminSectionPage from "../pages/admin/AdminSectionPage.jsx";
import AdminVideosPage from "../pages/admin/AdminVideosPage.jsx";
import ContactPage from "../pages/public/ContactPage.jsx";
import HomePage from "../pages/public/HomePage.jsx";
import ProjectsPage from "../pages/public/ProjectsPage.jsx";
import ShowcasePage from "../pages/public/ShowcasePage.jsx";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/creative" element={<ShowcasePage />} />
        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="content/:sectionKey" element={<AdminSectionPage />} />
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="videos" element={<AdminVideosPage />} />
      </Route>
    </Routes>
  );
}

export default App;

import { Route, Routes } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';

import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProjectForm from './pages/admin/ProjectForm';

export default function App() {
  return (
    <Routes>
      {/* Sito pubblico */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/progetti" element={<Projects />} />
        <Route path="/progetti/:slug" element={<ProjectDetail />} />
        <Route path="/contatti" element={<Contact />} />
      </Route>

      {/* Login admin (non protetto) */}
      <Route path="/admin" element={<Login />} />

      {/* Area admin protetta */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/projects/new" element={<ProjectForm />} />
          <Route path="/admin/projects/:id/edit" element={<ProjectForm />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-base-bg text-center">
            <p className="font-mono text-neon">404</p>
            <h1 className="text-2xl font-bold text-base-text">Pagina non trovata</h1>
            <a href="/" className="btn-secondary mt-2">
              Torna alla home
            </a>
          </div>
        }
      />
    </Routes>
  );
}

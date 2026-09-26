import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-base-bg">
      <header className="sticky top-0 z-40 border-b border-base-border bg-base-bg/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/admin/dashboard" className="font-mono text-sm font-semibold text-base-text focus-ring rounded">
            <span className="text-neon">&gt;</span> admin
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="text-xs text-base-muted hover:text-neon">
              Vedi sito pubblico ↗
            </Link>
            <button type="button" onClick={handleLogout} className="btn-secondary !px-3 !py-1.5 text-xs">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <Outlet />
      </main>
    </div>
  );
}

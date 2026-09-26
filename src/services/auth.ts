const SESSION_KEY = 'portfolio_admin_session';

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME ?? 'admin';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD ?? 'admin';

export function login(username: string, password: string): boolean {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ username, loggedInAt: Date.now() })
    );
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return false;
  try {
    const session = JSON.parse(raw);
    return Boolean(session?.username);
  } catch {
    return false;
  }
}

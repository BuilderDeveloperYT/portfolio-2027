import { useCallback, useState } from 'react';
import * as authService from '../services/auth';

export function useAuth() {
  const [authenticated, setAuthenticated] = useState<boolean>(authService.isAuthenticated());

  const login = useCallback((username: string, password: string) => {
    const ok = authService.login(username, password);
    setAuthenticated(ok);
    return ok;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setAuthenticated(false);
  }, []);

  return { authenticated, login, logout };
}

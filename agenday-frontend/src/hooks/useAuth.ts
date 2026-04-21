import { useAuthStore } from '../store/auth.store';

export function useAuth() {
  const { token, user, setAuth, logout } = useAuthStore();
  return { isAuthenticated: !!token, user, setAuth, logout };
}

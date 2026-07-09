import { useState, useCallback } from "react";
import { login as loginService, logout as logoutService, getCurrentUser, isAuthenticated } from "../services/auth.service";

export function useAuth() {
  const [user, setUser] = useState(getCurrentUser);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (usuario, password) => {
    setLoading(true);
    try {
      const result = await loginService(usuario, password);
      setUser(result.user);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    logoutService();
    setUser(null);
  }, []);

  return {
    user,
    loading,
    isLoggedIn: isAuthenticated(),
    login,
    logout,
  };
}

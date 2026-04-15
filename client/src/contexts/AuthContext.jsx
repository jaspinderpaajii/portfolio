import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchCurrentAdmin, loginAdmin } from "../api/adminApi";
import { setAuthToken } from "../api/http";

const AuthContext = createContext(null);
const STORAGE_KEY = "portfolio-admin-token";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setAuthToken(null);
      setLoading(false);
      return;
    }

    setAuthToken(token);
    fetchCurrentAdmin()
      .then((response) => {
        setUser(response.user);
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setAuthToken(null);
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      async login(credentials) {
        const response = await loginAdmin(credentials);
        localStorage.setItem(STORAGE_KEY, response.token);
        setToken(response.token);
        setAuthToken(response.token);
        setUser(response.user);
        return response;
      },
      logout() {
        localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setUser(null);
        setAuthToken(null);
      }
    }),
    [loading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

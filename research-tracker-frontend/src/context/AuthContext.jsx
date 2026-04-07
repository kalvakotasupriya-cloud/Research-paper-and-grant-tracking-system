import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as authService from "../services/authService";
import { setUnauthorizedHandler } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    setUser(null);
    setToken("");
    setRole("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearAuth();
    });
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const profileRes = await authService.getProfile();
        const profile = profileRes.data || profileRes;
        setUser(profile);
        setRole(profile.role);
        setToken(storedToken);
      } catch (error) {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const userData = response.data || response.user;

    localStorage.setItem("token", response.token);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(response.token);
    setUser(userData);
    setRole(userData.role);
    return userData;
  };

  const logout = async () => {
    await authService.logout();
    clearAuth();
  };

  const isAuthenticated = () => Boolean(token);

  const value = useMemo(
    () => ({
      user,
      token,
      role,
      loading,
      login,
      logout,
      isAuthenticated
    }),
    [user, token, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

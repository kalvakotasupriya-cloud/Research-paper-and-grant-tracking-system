import api from "./api";

export const login = async (email, password) => {
  const response = await api.post("/api/auth/login", { email, password });
  return response.data;
};

export const register = async (name, email, password, role) => {
  const response = await api.post("/api/auth/register", { name, email, password, role });
  return response.data;
};

export const logout = async () => {
  try {
    await api.post("/api/auth/logout");
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

export const getProfile = async () => {
  const response = await api.get("/api/auth/profile");
  return response.data;
};

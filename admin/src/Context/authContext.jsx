import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  // ============================
  // ✅ LOGIN
  // ============================
  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/admin/login", {
        email,
        password,
      });

      const adminData = res.data.data;
      setAdmin(adminData);

      sessionStorage.setItem("adminData", JSON.stringify(adminData));

      navigate("/home");
    } catch (error) {
      console.log("Login failed:", error);
      alert("Invalid credentials");
    }
  };

  // ============================
  // ✅ LOGOUT
  // ============================
  const logout = async () => {
    try {
      await axiosInstance.post("/admin/logout");
    } catch (err) {
      console.warn("Logout request failed but clearing local session.");
    }

    sessionStorage.removeItem("adminData");
    setAdmin(null);
    navigate("/");
  };

  // ============================
  // ✅ RESTORE SESSION ON REFRESH
  // ============================
  useEffect(() => {
    const stored = sessionStorage.getItem("adminData");

    if (stored) {
      setAdmin(JSON.parse(stored));
      return;
    }

    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/admin/profile");
        const adminData = res.data.data;

        setAdmin(adminData);
        sessionStorage.setItem("adminData", JSON.stringify(adminData));
      } catch (err) {
        setAdmin(null);
      }
    };

    checkAuth();
  }, []);

  // ============================
  // ✅ AUTO REFRESH TOKEN
  // ============================
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await axiosInstance.post("/admin/refreshToken");
        console.log("🔄 Token refreshed");
      } catch (err) {
        console.warn("Refresh failed — Logging out...");
        logout(); // Only logs out once — safe
      }
    }, 10 * 60 * 1000); // every 10 min

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

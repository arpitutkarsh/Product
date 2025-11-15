import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  // ✅ Login
  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/admin/login", { email, password });

      // Backend sets httpOnly cookies
      const adminData = res.data.data;
      setAdmin(adminData);
      sessionStorage.setItem("adminData", JSON.stringify(adminData));

      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid credentials");
    }
  };

  // ✅ Logout
  const logout = async () => {
    try {
      await axiosInstance.post("/admin/logout");
    } catch (error) {
      console.warn("Logout failed (clearing local state anyway).");
    } finally {
      sessionStorage.removeItem("adminData");
      setAdmin(null);
      navigate("/");
    }
  };

  // ✅ Auto-restore session on page refresh
  useEffect(() => {
    const storedAdmin = sessionStorage.getItem("adminData");
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    } else {
      const checkAuth = async () => {
        try {
          const res = await axiosInstance.get("/admin/profile");
          setAdmin(res.data.data);
          sessionStorage.setItem("adminData", JSON.stringify(res.data.data));
        } catch {
          setAdmin(null);
        }
      };
      checkAuth();
    }
  }, []);

  // ✅ Auto-refresh access token every 10 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await axiosInstance.post("/admin/refreshToken");
        console.log("🔄 Access token refreshed (background)");
      } catch (err) {
        console.warn("Auto-refresh failed:", err);
        logout();
      }
    }, 10 * 60 * 1000); // every 10 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

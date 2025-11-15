import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  // ✅ Login (cookies automatically saved by browser)
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

  // ✅ Logout (clears cookie + local state)
  const logout = async () => {
    try {
      await axiosInstance.post("/admin/logout");
    } catch (err) {
      console.warn("Logout failed but clearing state");
    }

    sessionStorage.removeItem("adminData");
    setAdmin(null);
    navigate("/");
  };

  // ✅ Restore admin from session or backend
  useEffect(() => {
    const stored = sessionStorage.getItem("adminData");

    if (stored) {
      setAdmin(JSON.parse(stored));
      return;
    }

    // Otherwise check backend
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get("/admin/profile");
        setAdmin(res.data.data);
        sessionStorage.setItem("adminData", JSON.stringify(res.data.data));
      } catch (err) {
        setAdmin(null);
      }
    };

    checkAuth();
  }, []);

  // ✅ Auto refresh access token every 10 min
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await axiosInstance.post("/admin/refreshToken");
        console.log("🔄 Access token refreshed");
      } catch (err) {
        console.warn("Refresh failed — logging out");
        logout();
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  // ---------- LOGIN ----------
  // Returns admin data on success, throws on error
  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/admin/login", { email, password });

      if (res.status === 200 || res.status === 201) {
        const adminData = res.data.data;
        setAdmin(adminData);
        sessionStorage.setItem("adminData", JSON.stringify(adminData));
        return adminData;
      } else {
        throw new Error(res.data?.message || "Login failed");
      }
    } catch (error) {
      // Normalize error
      const errMsg =
        error.response?.data?.message || error.message || "Login failed";
      throw new Error(errMsg);
    }
  };

  // ---------- LOGOUT ----------
  const logout = useCallback(async () => {
    try {
      // Try calling backend logout (clears DB refresh tokens)
      await axiosInstance.post("/admin/logout");
    } catch (err) {
      // ignore network errors but still clear client-side
      console.warn("Logout request failed (still clearing client state).", err?.message);
    }

    sessionStorage.removeItem("adminData");
    setAdmin(null);
    navigate("/");
  }, [navigate]);

  // ---------- RESTORE SESSION ----------
  useEffect(() => {
    const stored = sessionStorage.getItem("adminData");
    if (stored) {
      try {
        setAdmin(JSON.parse(stored));
      } catch {
        sessionStorage.removeItem("adminData");
        setAdmin(null);
      }
    }
  }, []);

  // ---------- AUTO-REFRESH INTERVAL ----------
  // This periodically pings the refresh endpoint to rotate tokens.
  useEffect(() => {
    const refreshPeriod = 10 * 60 * 1000; // 10 minutes

    const tick = async () => {
      try {
        await axiosInstance.post("/admin/refresh");
        // console.log("Token refreshed");
      } catch (err) {
        // If refresh fails, log out client-side
        console.warn("Auto-refresh failed — logging out", err?.message);
        logout();
      }
    };

    const interval = setInterval(() => {
      // Only attempt if we think we have an admin (avoid unnecessary calls)
      if (admin) tick();
    }, refreshPeriod);

    return () => clearInterval(interval);
  }, [admin, logout]);

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

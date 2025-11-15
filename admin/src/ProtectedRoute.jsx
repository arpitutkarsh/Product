// src/Components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./Context/authContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { admin } = useAuth(); // or whatever your context stores for logged-in admin

  //  If not logged in, redirect to login
  if (!admin) {
    return <Navigate to="/" replace />;
  }

  // ✅ Otherwise, show the requested page
  return children;
};

export default ProtectedRoute;

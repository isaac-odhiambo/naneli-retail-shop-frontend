// src/components/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**
 * A higher-order component to protect routes.
 * It checks if the user is authenticated before rendering the children.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Render the child components if the user is authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Redirect unauthenticated users to the login page
  return <Navigate to="/login" replace />;
}

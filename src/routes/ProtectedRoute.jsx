import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import authService from "../Services/authService";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const location = useLocation();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={`${process.env.PUBLIC_URL}/login`} replace state={{ from: location }} />;
  }

  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to={authService.getDashboardPath(role)} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

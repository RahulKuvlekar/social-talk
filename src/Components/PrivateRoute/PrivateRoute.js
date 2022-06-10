import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAuthData } from "../../Pages/Authentication/AuthenticationSlice";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useSelector(getAuthData);
  const location = useLocation();

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default PrivateRoute;

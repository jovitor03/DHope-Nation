import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, path }) => {
  const token = localStorage.getItem("authToken");

  const userType = localStorage.getItem("user_type");

  useEffect(() => {
    console.log("User type: ", userType);
  }, [userType]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (userType === "Donor" && path === "/create-campaign") {
    return <Navigate to="/homepage" />;
  }

  if (userType === "Campaign Creator" && path === "/leaderboards") {
    return <Navigate to="/homepage" />;
  }

  return element;
};

export default ProtectedRoute;

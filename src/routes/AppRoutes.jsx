import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import Layout from "../components/Layout"; // Ensure the path is correct
import NotFound from "../pages/NotFound"; // Import the NotFound component
import ForgotPassword from "../pages/ForgotPassword"; // Import the ForgotPassword component
import SessionTimeout from "../pages/SessionTimeout";
import ChangePassword from "../pages/ChangePassowrd";
import RoleMaster from "../user-management/RoleMaster";
import CreateUser from "../user-management/CreateUser";
import DdoMaster from "../user-management/DdoMaster";
import DepartmentMaster from "../user-management/DepartmentMaster";
import SalutationMaster from "../hrms/SalutationMaster"
import UserTypeMaster from "../user-management/UserTypeMaster"

const AppRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("token")); // Initial check for token

  // Check authentication status on a regular basis
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(!!Cookies.get("token")); // Update authentication state
    };

    checkAuth(); // Initial check on component mount
    const interval = setInterval(checkAuth, 1000); // Periodic checks

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  return (
    <div className={`app ${isAuthenticated ? "with-sidebar" : "without-sidebar"}`}>
      {isAuthenticated ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/role-master" element={<ProtectedRoute element={<RoleMaster />} />} />
            <Route path="/create-user" element={<ProtectedRoute element={<CreateUser />} />} />
            <Route path="/ddo-master" element={<ProtectedRoute element={<DdoMaster />} />} />
            <Route path="/department-master" element={<ProtectedRoute element={<DepartmentMaster />} />} />
            <Route path="/salutation-master" element={<ProtectedRoute element={<SalutationMaster />} />} />
            <Route path="/user-type-master" element={<ProtectedRoute element={<UserTypeMaster />} />} />
            {/* Add NotFound route here for any undefined paths */}
            <Route path="*" element={<NotFound />} /> {/* Render NotFound for any undefined paths */}
          </Routes>
        </Layout> 
      ) : (
        <Routes>
          <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Add ForgotPassword route */}
          <Route path="/changepassword" element={<ChangePassword />} />
          <Route path="/sessiontimeout" element={<SessionTimeout />} />
          <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes to Login */}
        </Routes>
      )}
    </div>
  );
};

export default AppRoutes;

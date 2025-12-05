import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import Repo from "@/pages/repo/Repo";
import Analysis from "@/pages/analysis/Analysis";
import AuthCallback from "@/components/auth/AuthCallback";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />

      {/* GitHub OAuth Callback */}
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/repo/:id"
        element={
          <ProtectedRoute>
            <Repo />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analysis/:id"
        element={
          <ProtectedRoute>
            <Analysis />
          </ProtectedRoute>
        }
      />

      {/* 404 Page */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">404</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Page not found
              </p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

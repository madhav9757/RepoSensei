import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Repo from "@/pages/Repo/Repo"; // your Repo.jsx page
import RepoDetails from "@/components/repo/RepoDetails"; // optional, detailed repo info
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "@/components/layout/Navbar";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/repo/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <Repo />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/repo/:owner/:repo"
        element={
          <ProtectedRoute>
            <Layout>
              <RepoDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
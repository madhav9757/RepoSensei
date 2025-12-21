import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Repo from "@/pages/Repo/Repo";
import ProtectedRoute from "./ProtectedRoute";
import Navbar from "@/components/layout/Navbar";
import RepoStructure from "@/pages/repo/RepoStructure";
import RepoInfo from "@/pages/repo/RepoInfo";

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
      {/* Optional Footer */}
      {/* <footer className="py-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} YourApp. All rights reserved.
      </footer> */}
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
              <RepoInfo />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/repo/:owner/:repo/structure"
        element={
          <ProtectedRoute>
            <Layout>
              <RepoStructure />
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// frontend/src/App.jsx
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { ToastContainer } from "./components/ui/toast";
import Loader from "./components/common/SkeletonLoader";
import useStore from "./store/useStore";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Repo = lazy(() => import("./pages/repo/Repo"));
const Analysis = lazy(() => import("./pages/analysis/Analysis"));

function App() {
  const theme = useStore((state) => state.theme);

  // Update root class based on theme - only runs when theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]); // Only depend on theme value, not the whole object

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
          <Navbar />

          <main className="flex-1">
            <Suspense fallback={<Loader message="Loading page..." fullScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/repo/:id" element={<Repo />} />
                <Route path="/analysis/:id" element={<Analysis />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />

          {/* Toast notifications */}
          <ToastContainer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          404
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Page not found</p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}

export default App;
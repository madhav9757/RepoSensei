import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Repo from "./pages/repo/Repo";
import Analysis from "./pages/analysis/Analysis";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
              <Navbar />
              
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/repo/:id" element={<Repo />} />
                  <Route path="/analysis/:id" element={<Analysis />} />
                  <Route 
                    path="*" 
                    element={
                      <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center space-y-4">
                          <h1 className="text-4xl font-bold">404</h1>
                          <p className="text-gray-600 dark:text-gray-400">Page not found</p>
                        </div>
                      </div>
                    } 
                  />
                </Routes>
              </main>

              <Footer />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Repo from "./pages/repo/Repo";
import Analysis from "./pages/analysis/Analysis";
import Navbar from "./components/layout/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/repo/:id" element={<Repo />} />
            <Route path="/analysis/:id" element={<Analysis />} />
            <Route path="*" element={<p className="text-center mt-8">Page not found</p>} />
          </Routes>
        </div>
      </main>
    </Router>
  );
}

export default App;

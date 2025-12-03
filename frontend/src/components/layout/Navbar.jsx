import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          RepoSensei
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-sm font-medium">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}

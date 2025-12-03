import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to <span className="text-blue-600">RepoSensei</span>
      </h1>

      <p className="text-gray-600 max-w-xl mx-auto mb-8">
        Analyze your GitHub repositories, generate file structure insights,
        improve code quality, and receive AI-powered suggestions.
      </p>

      <Link to="/dashboard">
        <Button size="lg">Go to Dashboard</Button>
      </Link>
    </div>
  );
}

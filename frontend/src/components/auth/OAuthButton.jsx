import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OAuthButton() {
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  const handleLogin = () => {
    // Redirect to backend GitHub OAuth flow
    window.location.href = `${API_BASE_URL}/auth/github/login`;
  };

  return (
    <Button
      onClick={handleLogin}
      size="lg"
      className="gap-2 px-8 bg-gray-900 hover:bg-gray-800 text-white"
    >
      <Github className="size-5" />
      Sign In with GitHub
    </Button>
  );
}
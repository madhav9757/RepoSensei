import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OAuthButton() {
  const SERVER_URL =
    import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  const handleLogin = () => {
    window.location.assign(`${SERVER_URL}/auth/github/login`);
  };

  return (
    <Button
      onClick={handleLogin}
      size="lg"
      className="gap-2 px-8 bg-gray-900 hover:bg-gray-800 text-white"
    >
      <Github className="size-5" />
      Sign in with GitHub
    </Button>
  );
}

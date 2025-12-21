import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export default function OAuthButton() {
  const [loading, setLoading] = useState(false);
  const SERVER_URL =
    import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

  const handleLogin = () => {
    try {
      setLoading(true);
      toast.loading("Redirecting to GitHub...");
      window.location.assign(`${SERVER_URL}/auth/github/login`);
    } catch (err) {
      setLoading(false);
      toast.error("Unable to start GitHub login");
    }
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

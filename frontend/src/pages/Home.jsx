import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Sparkles, FileSearch, TrendingUp, Github, ArrowRight, LogOut } from "lucide-react";
import OAuthButton from "@/components/auth/OAuthButton";
import useStore from "@/store/useStore";

export default function Home() {
  const user = useStore((state) => state.user);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const logout = useStore((state) => state.logout);
  const navigate = useNavigate();

  // Auto-redirect if logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const features = [
    { icon: Code2, title: "Smart Analysis", description: "Deep dive into your codebase with AI-powered insights and recommendations" },
    { icon: FileSearch, title: "File Structure", description: "Visualize and understand your repository architecture instantly" },
    { icon: TrendingUp, title: "Quality Metrics", description: "Track code quality, complexity, and maintainability scores" },
    { icon: Sparkles, title: "AI Suggestions", description: "Get intelligent recommendations to improve your code" }
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-gray-900/[0.04] dark:bg-grid-white/[0.02]" />
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
              <Sparkles className="size-4" />
              AI-Powered Code Analysis
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              Transform Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                GitHub Repos
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
              RepoSensei analyzes your repositories with advanced AI, providing actionable insights
              to improve code quality, structure, and maintainability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {!isAuthenticated ? (
                <OAuthButton />
              ) : (
                <div className="flex gap-4 items-center">
                  {/* Go to Dashboard */}
                  <Link to="/dashboard">
                    <Button size="lg" className="gap-2 px-8">
                      <Github className="size-5" />
                      Go to Dashboard
                      <ArrowRight className="size-4" />
                    </Button>
                  </Link>
                  {/* Avatar + Logout */}
                  <div className="flex items-center gap-2">
                    <img
                      src={`https://github.com/${user?.username || 'shadcn'}.png`}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="font-medium">{user?.username || user?.name || 'User'}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1"
                      onClick={logout}
                    >
                      <LogOut className="size-4" />
                      Logout
                    </Button>
                  </div>
                </div>
              )}

              <Button size="lg" variant="outline" className="gap-2 px-8">
                View Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Everything You Need to Analyze Code
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Powerful features to help you understand and improve your repositories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 space-y-4">
                <div className="size-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="size-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
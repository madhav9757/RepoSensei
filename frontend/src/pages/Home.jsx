import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Code2,
  Sparkles,
  FileSearch,
  TrendingUp,
  Github,
  ArrowRight,
} from "lucide-react";
import OAuthButton from "@/components/auth/OAuthButton";
import useAuthStore from "@/store/authStore";

export default function Home() {
  const { user, loading } = useAuthStore();
  const isAuthenticated = !!user;

  const features = [
    {
      icon: Code2,
      title: "Smart Analysis",
      description: "AI-powered insights to understand your codebase deeply",
    },
    {
      icon: FileSearch,
      title: "File Structure",
      description: "Instantly visualize repository architecture",
    },
    {
      icon: TrendingUp,
      title: "Quality Metrics",
      description: "Track maintainability and complexity scores",
    },
    {
      icon: Sparkles,
      title: "AI Suggestions",
      description: "Actionable recommendations to improve code quality",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 text-center space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI-Powered Code Analysis
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
            {isAuthenticated ? (
              <>
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {user.username}
                </span>
              </>
            ) : (
              <>
                Transform Your{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  GitHub Repos
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
            {isAuthenticated
              ? "Jump back in and continue analyzing your repositories with RepoSensei."
              : "RepoSensei analyzes your repositories with AI, delivering insights to improve code quality and structure."}
          </p>

          {/* CTA Buttons */}
          {!loading && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4">
              {!isAuthenticated ? (
                <>
                  <OAuthButton className="w-full sm:w-auto" />
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    View Demo
                  </Button>
                </>
              ) : (
                <Link to="/dashboard">
                  <Button size="lg" className="gap-2 px-8">
                    <Github className="h-5 w-5" />
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Everything You Need to Analyze Code
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Powerful features designed for modern developers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all hover:-translate-y-1 hover:bg-gradient-to-br from-blue-50 to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-900"
              >
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}

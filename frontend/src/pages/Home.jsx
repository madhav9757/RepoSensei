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
import { motion } from "framer-motion";

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
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Background Animated Shapes */}
      <motion.div
        animate={{ x: [0, 50, 0], y: [0, 20, 0], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute w-72 h-72 bg-purple-400/30 rounded-full blur-3xl top-10 left-10"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, -20, 0], rotate: [0, -5, 5, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
        className="absolute w-96 h-96 bg-blue-400/20 rounded-full blur-3xl bottom-0 right-0"
      />

      {/* HERO SECTION */}
      <section className="relative z-10 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 text-center space-y-8">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium"
          >
            <Sparkles className="h-4 w-4 animate-spin-slow" />
            AI-Powered Code Analysis
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse-slow"
          >
            {isAuthenticated ? (
              <>
                Welcome back,{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-text-glow">
                  {user.username}
                </span>
              </>
            ) : (
              <>
                Transform Your{" "}
                <span className="relative">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-text-glow">
                    GitHub Repos
                  </span>
                </span>
              </>
            )}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300"
          >
            {isAuthenticated
              ? "Jump back in and continue analyzing your repositories with RepoSensei."
              : "RepoSensei analyzes your repositories with AI, delivering insights to improve code quality and structure."}
          </motion.p>

          {/* CTA Buttons */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4"
            >
              {!isAuthenticated ? (
                <>
                  <motion.div whileHover={{ scale: 1.1, rotate: [0, 2, -2, 0], y: -2 }} transition={{ type: "spring", stiffness: 200 }}>
                    <OAuthButton className="w-full sm:w-auto shadow-lg hover:shadow-2xl" />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1, rotate: [0, 2, -2, 0], y: -2 }} transition={{ type: "spring", stiffness: 200 }}>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg hover:shadow-2xl">
                      View Demo
                    </Button>
                  </motion.div>
                </>
              ) : (
                <Link to="/dashboard">
                  <motion.div whileHover={{ scale: 1.1, rotate: [0, 2, -2, 0], y: -2 }} transition={{ type: "spring", stiffness: 200 }}>
                    <Button size="lg" className="gap-2 px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-2xl">
                      <Github className="h-5 w-5" />
                      Go to Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center space-y-4 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-3xl sm:text-4xl font-bold"
          >
            Everything You Need to Analyze Code
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-gray-600 dark:text-gray-400"
          >
            Powerful features designed for modern developers
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <Card
                  className="group hover:shadow-2xl transition-all hover:-translate-y-2 hover:bg-gradient-to-br from-blue-50 to-purple-50 dark:hover:from-gray-800 dark:hover:to-gray-900"
                >
                  <CardContent className="p-6 space-y-4">
                    <motion.div
                      whileHover={{
                        scale: 1.2,
                        rotate: [0, 10, -10, 0],
                        y: -5,
                        boxShadow: "0px 8px 20px rgba(139,92,246,0.4)"
                      }}
                      className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white transition-transform"
                    >
                      <Icon className="h-6 w-6" />
                    </motion.div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Sparkles, FileSearch, TrendingUp, Github, ArrowRight } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Code2,
      title: "Smart Analysis",
      description: "Deep dive into your codebase with AI-powered insights and recommendations"
    },
    {
      icon: FileSearch,
      title: "File Structure",
      description: "Visualize and understand your repository architecture instantly"
    },
    {
      icon: TrendingUp,
      title: "Quality Metrics",
      description: "Track code quality, complexity, and maintainability scores"
    },
    {
      icon: Sparkles,
      title: "AI Suggestions",
      description: "Get intelligent recommendations to improve your code"
    }
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
              <Link to="/dashboard">
                <Button size="lg" className="gap-2 px-8">
                  <Github className="size-5" />
                  Connect GitHub
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 px-8">
                View Demo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-green-500" />
                Free for open source
              </div>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-blue-500" />
                No credit card required
              </div>
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

      {/* Stats Section */}
      <section className="bg-gray-50 dark:bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10k+", label: "Repositories Analyzed" },
              { value: "50k+", label: "AI Suggestions" },
              { value: "99%", label: "Accuracy Rate" },
              { value: "24/7", label: "Analysis Ready" }
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0 text-white">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to Elevate Your Code?
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Join thousands of developers using RepoSensei to improve their code quality
            </p>
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="gap-2 px-8">
                Get Started Now
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
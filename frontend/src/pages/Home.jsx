"use client";

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Code2,
  Sparkles,
  FileSearch,
  TrendingUp,
  ArrowRight,
  Zap,
  LayoutDashboard,
  Github,
  ChevronRight,
  ShieldCheck,
  Cpu
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import OAuthButton from "@/components/auth/OAuthButton";
import useAuthStore from "@/store/authStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  },
};

export default function Home() {
  const { user, loading } = useAuthStore();
  const isAuthenticated = !!user;

  const features = [
    {
      icon: Code2,
      title: "Smart Analysis",
      description: "AI-powered deep insights for your codebase.",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      icon: FileSearch,
      title: "File Structure",
      description: "Visualize repo architecture instantly.",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    },
    {
      icon: TrendingUp,
      title: "Quality Metrics",
      description: "Track maintainability and complexity.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      icon: Sparkles,
      title: "AI Suggestions",
      description: "Actionable code quality recommendations.",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-background">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="absolute inset-0 z-0 bg-radial-gradient from-primary/5 via-transparent to-transparent opacity-50" />

      {/* Floating Blobs */}
      <div className="absolute top-1/4 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px] animate-pulse delay-700" />

      <div className="relative z-10 px-6">
        <section className="container max-w-6xl mx-auto pt-28 pb-20 lg:pt-40 lg:pb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center text-center space-y-12"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="outline" className="px-4 py-1.5 gap-2 rounded-full border-primary/20 bg-primary/5 text-primary backdrop-blur-md">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">Enterprise Grade Intelligence</span>
              </Badge>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6 max-w-4xl">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                {isAuthenticated ? (
                  <>
                    Welcome, <br />
                    <span className="text-primary italic">{user.username}</span>
                  </>
                ) : (
                  <>
                    Understand <br />
                    <span className="text-gradient">Code with AI</span>
                  </>
                )}
              </h1>

              <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl leading-relaxed font-medium">
                {isAuthenticated
                  ? "Your repositories have been synchronized. Access the dashboard for deep technical insights and AI-driven optimizations."
                  : "RepoSensei is the ultimate companion for developers. Connect your GitHub and unlock architectural overviews and improvement paths."}
              </motion.p>
            </motion.div>

            {!loading && (
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {!isAuthenticated ? (
                  <>
                    <OAuthButton />
                    <Button variant="ghost" size="lg" className="rounded-full px-8 gap-2 group h-12 border">
                      <Cpu className="h-4 w-4 text-primary" />
                      View Documentation
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </>
                ) : (
                  <Button asChild size="lg" className="rounded-full px-10 gap-2 shadow-2xl shadow-primary/30 h-14 text-lg font-bold">
                    <Link to="/dashboard">
                      <LayoutDashboard className="h-5 w-5" />
                      Enter Dashboard
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                )}
              </motion.div>
            )}

            {/* Trust Badges */}
            <motion.div variants={itemVariants} className="pt-12 flex flex-wrap items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 font-bold text-sm"><Github size={20} /> GITHUB AUTH</div>
              <div className="flex items-center gap-2 font-bold text-sm"><ShieldCheck size={20} /> AES-256 SECURE</div>
              <div className="flex items-center gap-2 font-bold text-sm uppercase tracking-tighter text-xl">Repo<span className="text-primary">Sensei</span></div>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Preview */}
        <section className="container max-w-6xl mx-auto py-20">
          <Separator className="mb-20 opacity-50" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card className="h-full border-border/40 bg-card/40 backdrop-blur-xl transition-all hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 group">
                  <CardHeader className="space-y-6 p-8">
                    <div className={`p-3 w-fit rounded-2xl ${feature.bg} ${feature.color} shadow-inner transition-transform group-hover:scale-110`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div className="space-y-3">
                      <CardTitle className="text-xl font-black tracking-tight">{feature.title}</CardTitle>
                      <CardDescription className="text-sm font-medium leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <div className="relative h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "85%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + (index * 0.1) }}
                        className={`h-full bg-current ${feature.color} opacity-40`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        {!isAuthenticated && (
          <section className="container max-w-5xl mx-auto py-20 px-6">
            <div className="rounded-[2.5rem] bg-foreground p-12 md:p-20 text-background text-center space-y-8 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter relative z-10">Start Optimizing Today</h2>
              <p className="text-background/60 text-lg md:text-xl max-w-xl mx-auto relative z-10 font-medium">
                Join thousands of developers using RepoSensei to ship cleaner, more maintainable code.
              </p>
              <div className="relative z-10">
                <OAuthButton primary />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

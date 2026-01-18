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
  ChevronRight
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
  hidden: { y: 15, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 260, damping: 20 } 
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
      {/* Grid Background Primitives */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="relative z-10">
        <section className="container max-w-5xl mx-auto px-6 pt-24 pb-16 lg:pt-32 lg:pb-24">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={containerVariants}
            className="flex flex-col items-center text-center space-y-10"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="outline" className="px-3 py-1 gap-2 rounded-full border-primary/20 bg-primary/5 text-primary backdrop-blur-sm">
                <Zap className="h-3.5 w-3.5 fill-primary/20" />
                <span className="text-xs font-medium tracking-wide uppercase">v2.0 is now live</span>
              </Badge>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground">
                {isAuthenticated ? (
                  <>
                    Welcome back, <br />
                    <span className="text-muted-foreground">{user.username}</span>
                  </>
                ) : (
                  <>
                    Understand your <br />
                    <span className="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Codebase with AI
                    </span>
                  </>
                )}
              </h1>
              
              <motion.p variants={itemVariants} className="max-w-[38rem] mx-auto text-muted-foreground text-lg sm:text-xl leading-relaxed">
                {isAuthenticated
                  ? "Your repositories are indexed and ready for analysis. Pick up where you left off in your dashboard."
                  : "RepoSensei connects to your GitHub and provides high-level architectural overviews with AI-driven improvement paths."}
              </motion.p>
            </motion.div>

            {!loading && (
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                {!isAuthenticated ? (
                  <>
                    <OAuthButton />
                    <Button variant="ghost" size="lg" className="rounded-full px-8 gap-2 group">
                      Documentation
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </>
                ) : (
                  <Button asChild size="lg" className="rounded-full px-8 gap-2 shadow-lg shadow-primary/20">
                    <Link to="/dashboard">
                      <LayoutDashboard className="h-4 w-4" />
                      Open Dashboard
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </motion.div>
            )}
          </motion.div>
        </section>

        <section className="container max-w-6xl mx-auto px-6 py-12">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-md transition-colors hover:border-primary/20">
                  <CardHeader className="space-y-4">
                    <div className={`p-2.5 w-fit rounded-xl ${feature.bg} ${feature.color}`}>
                      <feature.icon className="h-5 w-5 fill-current/10" />
                    </div>
                    <div className="space-y-1.5">
                      <CardTitle className="text-base font-semibold">{feature.title}</CardTitle>
                      <CardDescription className="text-sm leading-snug">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="relative h-1 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "70%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                        className={`h-full bg-current ${feature.color} opacity-30`} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </div>
    </div>
  );
}
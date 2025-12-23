import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Code2,
  Sparkles,
  FileSearch,
  TrendingUp,
  ArrowRight,
  Zap,
  LayoutDashboard // Added missing import
} from "lucide-react";

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Logic & Auth
import OAuthButton from "@/components/auth/OAuthButton";
import useAuthStore from "@/store/authStore";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

export default function Home() {
  const { user, loading } = useAuthStore();
  const isAuthenticated = !!user;

  const features = [
    { icon: Code2, title: "Smart Analysis", description: "AI-powered deep insights for your codebase.", color: "text-blue-500" },
    { icon: FileSearch, title: "File Structure", description: "Visualize repo architecture instantly.", color: "text-purple-500" },
    { icon: TrendingUp, title: "Quality Metrics", description: "Track maintainability and complexity.", color: "text-emerald-500" },
    { icon: Sparkles, title: "AI Suggestions", description: "Actionable code quality recommendations.", color: "text-amber-500" },
  ];

  return (
    <div className="relative w-full overflow-x-hidden bg-background">
      {/* Background Mask */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10">
        <section className="container max-w-7xl mx-auto px-6 pt-20 pb-16 lg:pt-32 lg:pb-24">
          <motion.div 
            initial="hidden" 
            animate="visible" 
            variants={containerVariants}
            className="flex flex-col items-center text-center space-y-8"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="secondary" className="px-3 py-1 gap-2 rounded-full border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span>v2.0 is now live</span>
              </Badge>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-8xl font-extrabold tracking-tight">
              {isAuthenticated ? (
                <>
                  Welcome back, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-600">
                    {user.username}
                  </span>
                </>
              ) : (
                <>
                  Understand your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-blue-600">
                    Codebase with AI
                  </span>
                </>
              )}
            </motion.h1>

            <motion.p variants={itemVariants} className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              {isAuthenticated
                ? "Your repositories are indexed and ready for analysis. Pick up where you left off."
                : "RepoSensei connects to your GitHub and provides a high-level architectural overview and AI-driven improvement paths."}
            </motion.p>

            {!loading && (
              <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4">
                {!isAuthenticated ? (
                  <>
                    <OAuthButton />
                    <Button variant="outline" size="lg" className="rounded-full px-8">
                      View Documentation
                    </Button>
                  </>
                ) : (
                  <Button asChild size="lg" className="rounded-full px-8 shadow-xl shadow-primary/20 gap-2">
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

        <Separator className="max-w-4xl mx-auto opacity-50" />

        <section className="container max-w-7xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                // Fixed Animation: Use keyframes with "times" or change type to "keyframes"
                whileHover={{ 
                  y: -8,
                  transition: { type: "spring", stiffness: 300 } 
                }}
              >
                <Card className="h-full border-muted bg-card/50 backdrop-blur-sm transition-shadow hover:shadow-xl hover:shadow-primary/5">
                  <CardHeader>
                    <div className={`p-2 w-fit rounded-lg bg-muted ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="pt-4">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ x: "-100%" }}
                        whileInView={{ x: "0%" }}
                        transition={{ duration: 1.5, delay: index * 0.2 }}
                        className={`h-full w-2/3 bg-current ${feature.color} opacity-40`} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
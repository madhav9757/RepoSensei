import { motion } from "framer-motion";
import { Github, ShieldCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

// Shadcn UI
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OAuthButton from "@/components/auth/OAuthButton";

export default function Login() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute top-0 left-0 -z-10 h-full w-full">
        <div className="absolute top-1/2 left-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[400px]"
      >
        {/* Back Link */}
        <Link 
          to="/" 
          className="mb-6 flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Card className="border-none bg-card/50 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3)]">
          <CardHeader className="space-y-4 pt-8 text-center">
            {/* Minimalist Logo Icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
              <ShieldCheck className="h-6 w-6 text-primary-foreground" />
            </div>
            
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Welcome to RepoSensei
              </CardTitle>
              <CardDescription className="text-base">
                Choose a provider to sign in to your account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="grid gap-4 px-8 pb-8 pt-4">
            {/* The OAuthButton component should ideally handle its own Lucide icon (Github) internally */}
            <OAuthButton className="h-12 w-full rounded-xl transition-all hover:scale-[1.02] active:scale-95" />
            
            <div className="relative mt-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Secure OAuth 2.0
                </span>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 border-t border-muted/50 bg-muted/20 p-6 text-center">
            <p className="text-xs leading-relaxed text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="font-medium text-foreground underline-offset-4 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="font-medium text-foreground underline-offset-4 hover:underline">
                Privacy Policy
              </Link>.
            </p>
          </CardFooter>
        </Card>
        
        {/* Helper Footer Link */}
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Don't have a GitHub account?{" "}
          <a 
            href="https://github.com/join" 
            target="_blank" 
            className="font-semibold text-primary hover:underline"
          >
            Create one
          </a>
        </p>
      </motion.div>
    </div>
  );
}
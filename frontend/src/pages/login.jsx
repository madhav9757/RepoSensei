import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import OAuthButton from "@/components/auth/OAuthButton";
import { motion } from "framer-motion";
import {  ShieldCheck } from "lucide-react";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="w-full max-w-sm"
      >
        <Card className="shadow-2xl border border-border rounded-2xl backdrop-blur bg-background/80 flex flex-col items-center">
          {/* Logo & Header */}
          <CardHeader className="text-center space-y-2 pt-6 flex flex-col items-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-blue-500 animate-pulse" />
              <span className="text-xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                RepoSensei
              </span>
            </div>
            <CardTitle className="text-2xl font-semibold">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Sign in to continue with your account
            </CardDescription>
          </CardHeader>

          {/* OAuth Button */}
          <CardContent className="flex flex-col gap-4 mt-4 pb-6 px-6 w-full">
            <OAuthButton
              className="w-full justify-center flex items-center gap-2"
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

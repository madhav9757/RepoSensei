import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import OAuthButton from "@/components/auth/OAuthButton";

export default function Login() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm shadow-lg border border-border rounded-2xl">
        <CardHeader className="text-center space-y-1 pt-6">
          <CardTitle className="text-2xl font-semibold">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Sign in to continue to <span className="font-bold">RepoSensei</span>
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4 mt-4 pb-6 px-6">
          <OAuthButton />
        </CardContent>
      </Card>
    </div>
  );
}

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
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-[380px]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to continue to RepoSensei
          </CardDescription>
        </CardHeader>

        <CardContent className="flex justify-center">
          <OAuthButton />
        </CardContent>
      </Card>
    </div>
  );
}

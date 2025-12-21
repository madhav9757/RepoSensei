import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { Spinner } from "@/components/ui/spinner"; // optional shadcn spinner

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spinner className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

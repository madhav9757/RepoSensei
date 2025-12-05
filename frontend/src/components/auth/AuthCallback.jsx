import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import api from "@/utils/api";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    async function finishLogin() {
      try {
        const res = await api.get("/auth/me");
        if (res?.success && res.user) {
          setUser(res.user);
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      } catch {
        navigate("/");
      }
    }
    finishLogin();
  }, []);

  return <p className="p-6">Finishing login…</p>;
}

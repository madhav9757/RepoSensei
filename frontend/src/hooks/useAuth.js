import { useAuthContext } from "../context/AuthContext";

export default function useAuth() {
  return useAuthContext();
}

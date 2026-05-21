import { useAuthStore } from "@/store/auth-store";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const {
    login,
    clear,
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    identity,
    loginStatus,
  } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  const handleLogin = () => {
    if (!isAuthenticated) login();
  };

  const handleLogout = () => {
    clear();
    setUser(null);
    queryClient.clear();
  };

  return {
    isAuthenticated,
    isInitializing,
    isLoggingIn,
    loginStatus,
    identity,
    user,
    login: handleLogin,
    logout: handleLogout,
  };
}

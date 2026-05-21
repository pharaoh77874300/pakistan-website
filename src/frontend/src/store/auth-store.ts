import type { ProfileView } from "@/backend";
import type { AuthUser } from "@/types";
import { create } from "zustand";

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  setProfile: (profile: ProfileView | null) => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => {
    const current = get().user;
    if (current) {
      set({ user: { ...current, profile } });
    }
  },
}));

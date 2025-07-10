import { create } from 'zustand';

type Role = 'Admin' | 'User' | null;

interface AuthState {
  token: string | null;
  role: Role;
  username: string | null;
  setAuth: (token: string, role: Role, username: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  username: null,
  setAuth: (token, role, username) => {
    set({ token, role, username });
  },
  clearAuth: () => {
    set({ token: null, role: null, username: null });
  }
}));

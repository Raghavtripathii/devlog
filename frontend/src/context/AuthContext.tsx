// Global auth state — stores the current user and token.
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../lib/api";
import { User } from "../types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  // This handles page refreshes — the user stays logged in.
  useEffect(() => {
    const saved = localStorage.getItem("token");
    if (saved) {
      fetchCurrentUser(saved).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  async function fetchCurrentUser(jwt: string) {
    try {
      const res = await api.get<User>("/auth/me", {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      setUser(res.data);
    } catch {
      // Token is invalid or expired — clear everything
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  }

  async function login(jwt: string) {
    localStorage.setItem("token", jwt);
    setToken(jwt);
    await fetchCurrentUser(jwt);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { type AuthUser, MOCK_USERS } from "@/modules/auth/constants/users";

type AuthContextType = {
  user: AuthUser;
  login: (
    email: string,
    password: string,
  ) => { success: boolean; message?: string; defaultRoute?: string };
  logout: () => void;
};

const AUTH_STORAGE_KEY = "flow_auth_user";
const DEFAULT_USER = MOCK_USERS["admin@flow.eg"];

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser>(DEFAULT_USER);

  // Hydrate user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;

        if (parsed?.email && MOCK_USERS[parsed.email.toLowerCase()]) {
          setUser(MOCK_USERS[parsed.email.toLowerCase()]);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback((email: string, _password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const matchedUser = MOCK_USERS[normalizedEmail];

    if (!matchedUser) {
      return {
        success: false,
        message:
          "Invalid email. Available demo accounts: admin@flow.eg, sara.hassan@flow.eg, mostafa.ali@flow.eg, yara.selim@flow.eg",
      };
    }

    setUser(matchedUser);

    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchedUser));
      // biome-ignore lint/suspicious/noDocumentCookie: client cookie sync
      document.cookie = `flow_role=${matchedUser.role}; path=/; max-age=86400`;
    } catch {
      // ignore
    }

    return {
      success: true,
      defaultRoute: matchedUser.defaultRoute,
    };
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      // biome-ignore lint/suspicious/noDocumentCookie: client cookie sync
      document.cookie = "flow_role=; path=/; max-age=0";
    } catch {
      // ignore
    }
    router.push("/login");
  }, [router]);

  return <AuthContext value={{ user, login, logout }}>{children}</AuthContext>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

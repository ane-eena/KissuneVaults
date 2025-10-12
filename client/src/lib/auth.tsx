import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

interface User {
  _id: string;
  discordId: string;
  username: string;
  avatar?: string;
  isOwner: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isLoading } = useQuery<{ user: User | null }>({
    queryKey: ["/auth/user"],
  });

  const login = () => {
    window.location.href = "/auth/discord";
  };

  const logout = () => {
    window.location.href = "/auth/logout";
  };

  return (
    <AuthContext.Provider
      value={{ user: data?.user || null, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

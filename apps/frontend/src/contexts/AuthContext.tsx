import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User, Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signInWithMagicLink: (email: string) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  signOut: () => Promise<void>;
  // Helper functions for user data
  getUserDisplayName: () => string;
  getUserAvatar: () => string;
  getUserEmail: () => string;
  isGoogleUser: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  };

  const signInWithMagicLink = async (email: string) => {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { data, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Helper functions for user data
  const getUserDisplayName = () => {
    if (!user) return "";

    // Try to get name from user_metadata (Google OAuth)
    const fullName = user.user_metadata?.full_name || user.user_metadata?.name;
    if (fullName) return fullName;

    // Fallback to email
    return user.email || "User";
  };

  const getUserAvatar = () => {
    if (!user) return "";

    // Try to get avatar from user_metadata (Google OAuth)
    const avatarUrl =
      user.user_metadata?.avatar_url || user.user_metadata?.picture;
    if (avatarUrl) return avatarUrl;

    // Fallback to default avatar
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      getUserDisplayName()
    )}&background=6366f1&color=fff&size=40`;
  };

  const getUserEmail = () => {
    return user?.email || "";
  };

  const isGoogleUser = () => {
    if (!user) return false;

    // Check if user has Google in providers or user_metadata
    return (
      user.user_metadata?.provider_id ||
      user.user_metadata?.iss?.includes("google") ||
      user.app_metadata?.provider === "google"
    );
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithMagicLink,
    resetPassword,
    signOut,
    getUserDisplayName,
    getUserAvatar,
    getUserEmail,
    isGoogleUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

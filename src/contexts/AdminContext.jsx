import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";

/**
 * AdminContext — wraps Supabase Auth so admin status is verified
 * server-side rather than by a client-side password comparison.
 *
 * Usage:
 *   const { adminMode, login, logout, authLoading } = useAdmin();
 *
 * login(email, password) calls supabase.auth.signInWithPassword and
 * returns { error } — the caller is responsible for showing error messages.
 *
 * The Supabase session JWT is automatically attached to every subsequent
 * request, so RLS policies that check auth.role() = 'authenticated' will
 * correctly gate write operations.
 */

const AdminContext = createContext({
  adminMode:   false,
  authLoading: true,
  login:       async () => ({ error: null }),
  logout:      async () => {},
});

export function AdminProvider({ children }) {
  const [session,     setSession]     = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Restore session from Supabase on mount, and subscribe to auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setAuthLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AdminContext.Provider value={{
      adminMode:   !!session,
      authLoading,
      login,
      logout,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);

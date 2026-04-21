'use client';

import type { User } from 'firebase/auth';
import { onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { createContext, useEffect, useMemo, useState } from 'react';

import { getAuth } from '@/lib/firebase/config';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    const unsubToken = onIdTokenChanged(auth, async (u) => {
      if (!u) {
        setIsAdmin(false);
        return;
      }
      const token = await u.getIdTokenResult();
      setIsAdmin(token.claims.admin === true);
    });

    return () => {
      unsubAuth();
      unsubToken();
    };
  }, []);

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: !!user, isAdmin }),
    [user, loading, isAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

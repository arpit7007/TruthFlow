'use client';

import * as React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

const AuthContext = createContext({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
});

export function ThemeProvider({ children, ...props }) {
  const [authState, setAuthState] = useState({ 
    isLoggedIn: false, 
    user: null 
  });

  useEffect(() => {
    const savedStatus = localStorage.getItem('tf_auth_status');
    if (savedStatus === 'true') {
      setTimeout(() => {
        setAuthState({
          isLoggedIn: true,
          user: { name: 'TruthFlow User', email: 'user@truthflow.io' }
        });
      }, 0);
    }
  }, []);

  const login = (email) => {
    setAuthState({
      isLoggedIn: true,
      user: { name: 'TruthFlow User', email }
    });
    localStorage.setItem('tf_auth_status', 'true');
  };

  const logout = () => {
    setAuthState({
      isLoggedIn: false,
      user: null
    });
    localStorage.removeItem('tf_auth_status');
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

// Simple authentication context
// Exposes `user` object and `login/logout` helpers to the app
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Holds the authenticated user (null when logged out)
  const [user, setUser] = useState(null);

  // Set the user after successful authentication
  const login = (userData) => {
    setUser(userData);
  };

  // Clear the user to log out
  const logout = () => {
    setUser(null);
  };

  return (
    // Make `user`, `login`, and `logout` available to all children
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
import React, { createContext, useContext, useState, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll use simple role assignment
    if (username && password) {
      let role = null;
      switch (username.toLowerCase()) {
        case 'executive':
          role = 'Executive';
          break;
        case 'provider':
          role = 'Provider';
          break;
        case 'coordinator':
          role = 'Coordinator';
          break;
        case 'bdr':
          role = 'BDR';
          break;
        default:
          throw new Error('Invalid credentials');
      }
      setUserRole(role);
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid credentials');
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserRole(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
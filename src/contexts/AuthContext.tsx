import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  login: (email: string, name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check login status on mount
    const loggedIn = localStorage.getItem('marriott_user_logged_in') === 'true';
    const name = localStorage.getItem('marriott_user_name') || '';
    setIsLoggedIn(loggedIn);
    setUserName(name);
  }, []);

  const login = (email: string, name: string) => {
    localStorage.setItem('marriott_user_logged_in', 'true');
    localStorage.setItem('marriott_user_email', email);
    localStorage.setItem('marriott_user_name', name);
    setIsLoggedIn(true);
    setUserName(name);
  };

  const logout = () => {
    localStorage.removeItem('marriott_user_logged_in');
    localStorage.removeItem('marriott_user_email');
    localStorage.removeItem('marriott_user_name');
    setIsLoggedIn(false);
    setUserName('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 
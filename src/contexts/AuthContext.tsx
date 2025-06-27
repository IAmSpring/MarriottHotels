import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  userRole: string;
  login: (email: string, name: string, role: string) => void;
  logout: () => void;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    // For development: Set default admin user
    localStorage.setItem('marriott_user_logged_in', 'true');
    localStorage.setItem('marriott_user_email', 'admin@marriott.com');
    localStorage.setItem('marriott_user_name', 'Admin User');
    localStorage.setItem('marriott_user_role', 'ADMIN');
    
    // Check login status
    const loggedIn = localStorage.getItem('marriott_user_logged_in') === 'true';
    const name = localStorage.getItem('marriott_user_name') || '';
    const role = localStorage.getItem('marriott_user_role') || '';
    setIsLoggedIn(loggedIn);
    setUserName(name);
    setUserRole(role);
  }, []);

  const login = (email: string, name: string, role: string) => {
    localStorage.setItem('marriott_user_logged_in', 'true');
    localStorage.setItem('marriott_user_email', email);
    localStorage.setItem('marriott_user_name', name);
    localStorage.setItem('marriott_user_role', role);
    setIsLoggedIn(true);
    setUserName(name);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem('marriott_user_logged_in');
    localStorage.removeItem('marriott_user_email');
    localStorage.removeItem('marriott_user_name');
    localStorage.removeItem('marriott_user_role');
    setIsLoggedIn(false);
    setUserName('');
    setUserRole('');
  };

  const isAdmin = () => userRole === 'ADMIN';

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, userRole, login, logout, isAdmin }}>
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
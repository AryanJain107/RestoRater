import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAuthStatus = localStorage.getItem("isAuthenticated");
 
    if (storedUser && storedAuthStatus) {
      setUser(JSON.parse(storedUser));
      setAuthenticated(JSON.parse(storedAuthStatus));
    }
    setIsLoading(false); 
  }, []);

  const login = (userData) => {
    setUser(userData);
    setAuthenticated(true);
    
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("isAuthenticated", JSON.stringify(true));
  };

  const logout = () => {
    setUser(null);
    setAuthenticated(false);
    
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  };

  if (isLoading) {
    return null; 
  }
 
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

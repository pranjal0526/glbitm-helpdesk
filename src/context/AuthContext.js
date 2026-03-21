import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Fake user for testing — remove this later when backend is ready
  const [user, setUser] = useState({
    name: 'Pavan Kumar',
    email: 'pavan@glbitm.ac.in',
    avatar: null,
    role: 'student'
  });

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, loading: false, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
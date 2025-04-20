import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('token');
      const userData = await AsyncStorage.getItem('user');

      setIsAuthenticated(!!token);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    };
    checkAuth();
  }, []);

  const login = async (responseData) => {
    const { token, idUsuario, rol } = responseData;

    const userData = {
      idUsuario,
      role: rol,
    };

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(userData));

    console.log("🔐 Guardando token:", token, "🗝️ ID Usuario:", idUsuario);

    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

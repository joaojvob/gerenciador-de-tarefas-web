import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicializa o state com o Me do Backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get('/api/auth/me');
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    await api.get('/sanctum/csrf-cookie');
    const { data } = await api.post('/api/auth/login', credentials);
    setUser(data.user);
  };

  const register = async (data) => {
    const response = await api.post('/api/auth/register', data);
    setUser(response.data.user);
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
        {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

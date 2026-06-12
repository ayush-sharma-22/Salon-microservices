import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const profile = await authAPI.getProfile();
      setUser(profile);
    } catch (err) {
      console.error('Failed to get user profile', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await authAPI.login(username, password);
      localStorage.setItem('token', data.jwtToken);
      if (data.refressToken) {
        localStorage.setItem('refreshToken', data.refressToken);
      }
      const profile = await authAPI.getProfile();
      setUser(profile);
      return profile;
    } catch (err) {
      logout();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (signupData) => {
    setLoading(true);
    try {
      const data = await authAPI.signup(signupData);
      localStorage.setItem('token', data.jwtToken);
      if (data.refressToken) {
        localStorage.setItem('refreshToken', data.refressToken);
      }
      const profile = await authAPI.getProfile();
      setUser(profile);
      return profile;
    } catch (err) {
      logout();
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser: checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

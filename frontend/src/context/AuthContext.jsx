import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for token on mount
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const updateUser = (data) => {
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const login = async (email, password) => {
    try {
      const normalizedEmail = email?.toLowerCase();
      const { data } = await axios.post('/api/auth/login', { email: normalizedEmail, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Logged in successfully!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const normalizedData = { ...userData, email: userData.email?.toLowerCase() };
      const { data } = await axios.post('/api/auth/register', normalizedData);
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('Registration successful!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { socket } from '../socket';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData);
      socket.emit('join', { userId: userData.id });
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    socket.emit('join', { userId: res.data.user.id });
  };

  return (
    <AuthContext.Provider value={{ user, login, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
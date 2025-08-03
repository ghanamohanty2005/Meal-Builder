import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '../api/authApi';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [profilePicUrl, setProfilePicUrl] = useState(null);

  // Fetch and store user data from backend
  const fetchAndSetUser = async () => {
    try {
      const res = await fetchUserProfile();
      console.log("✅ User profile fetched:", res.data);
      console.log("🌐 Fetching user profile with token:", localStorage.getItem("token"));


      setUser(res.data);
      setProfilePicUrl(res.data.profilePicUrl || null);
    } catch (err) {
      console.error("❌ Failed to fetch user profile", err);
      logout(); // optional: clear invalid token
    }
  };

  // Login method: store token and load profile
  const login = (newToken) => {
    console.log("🔑 Login - Storing token:", newToken);
    setToken(newToken);
    localStorage.setItem("token", newToken);
    fetchAndSetUser();
  };

  // Logout method: clear everything
  const logout = () => {
    console.log("🚪 Logging out...");
    setToken(null);
    setUser(null);
    setProfilePicUrl(null);
    localStorage.removeItem("token");
  };

  // On initial load, if token exists, fetch profile
  useEffect(() => {
    if (token && !user) {
      console.log("📦 Found saved token, fetching user...");
      fetchAndSetUser();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, profilePicUrl, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

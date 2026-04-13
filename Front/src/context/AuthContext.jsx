
import { createContext, useState, useEffect } from "react";
import API from "../api/api";
 
export const AuthContext = createContext();
 
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
 
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);
 
  // ✅ This now accepts backend response directly
  const loginUser = (data) => {
    const { user: userData, accessToken } = data;
 
    if (!userData || !accessToken) return;
 
    setUser(userData);
    localStorage.setItem("accessToken", accessToken);
  };
 
  const logoutUser = async () => {
    try {
      await API.post("/auth/logout");
    } catch {}
    setUser(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  };
 
  const updateUsername = (username) => {
    setUser((prev) => (prev ? { ...prev, username } : prev));
  };
 
  const updateProfileImage = (profileImage) => {
    setUser((prev) => (prev ? { ...prev, profileImage } : prev));
  };
 
  return (
    <AuthContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        updateUsername,
        updateProfileImage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
 
 
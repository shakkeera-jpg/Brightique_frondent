import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.get(`https://brightique.onrender.com/users?email=${email}`);
      if (res.data.length > 0 && res.data[0].password === password) {
        const loggedUser = res.data[0];
        const updatedUser = {
          ...loggedUser,
          lastLogin: new Date().toISOString(),
        };
 if (loggedUser.isBlocked) {
      return { success: false, message: "Your account is blocked. Contact support." };
    }

        await axios.patch(`https://brightique.onrender.com/users/${loggedUser.id}`, {
          lastLogin: updatedUser.lastLogin,
        });

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return { success: true };
      } else {
        return { success: false, message: "Invalid email or password" };
      }
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server error" };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const existing = await axios.get(`https://brightique.onrender.com/users?email=${email}`);
      if (existing.data.length > 0) {
        return { success: false, message: "Email already exists" };
      }

      const newUser = {
        name,
        email,
        password,
        cart: [],
        wishlist: [],
        date: new Date().toISOString(),
        orders: [],
        isBlocked: false,
        role: "user",
      };

      await axios.post("https://brightique.onrender.com/users", newUser);

      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: "Server error" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoggedIn, loading ,setUser}}>
      {children}
    </AuthContext.Provider>
  );
}

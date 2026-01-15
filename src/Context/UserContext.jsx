import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [Authloading, setLoading] = useState(true);

  //  Restore user on refresh
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const access = localStorage.getItem("access");

      if (storedUser && storedUser !== "undefined" && access) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Invalid user in localStorage", error);
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // REGISTER
  const signup = async (name, email, password) => {
    await api.post("register/", { name, email, password });
    return { success: true };
  };

  // LOGIN
  const login = async (email, password) => {
  try {
    const res = await api.post("login/", { email, password });

    const { access, refresh, id, name, is_admin } = res.data;

    const user = {
      id,
      email,
      name,
      is_admin,
    };

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("user", JSON.stringify(user));

    setUser(user);

     return { success: true, is_admin: user.is_admin };
  } catch (err) {
    return {
      success: false,
      message:
        err.response?.data?.detail || "Invalid email or password",
    };
  }
};


  //  GOOGLE LOGIN 
  const googleLogin = (data) => {
    const { access, refresh, user } = data;

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem("user", JSON.stringify(user)); 

    setUser(user);
  };

  
  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        googleLogin,
        logout,
        Authloading,
      }}
    >
      {!Authloading && children}
    </AuthContext.Provider>
  );
}

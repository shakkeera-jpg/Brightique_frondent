import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../Context/UserContext";

export default function Login() {
  const { login, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      if (user.isBlocked) {
        alert("You're blocked! Contact support.");
      } else if(user?.role==="admin"){
        navigate("/admin"); 
      }else{
        navigate("/")
      }
    }
  }, [user,navigate,loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    if (result.success) {
      if (result.user?.isBlocked) {  
        alert("You're blocked! Cannot login.");
        return;
      }
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (user?.isBlocked) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 shadow-lg rounded-2xl w-[400px] text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-500">
            You are blocked!
          </h2>
          <p>Please contact support for access.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-2xl w-[400px]">
        <h2 className="text-3xl font-semibold text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border rounded-lg p-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded-lg p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Login
          </button>
          <p className="text-sm text-center mt-3">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-semibold">
              Create An Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../Context/UserContext";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function Login() {
  const { login, googleLogin,user,Authloading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasFlickered, setHasFlickered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasFlickered(true);
      setIsRevealed(true);
    }, 1200); 
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        result.is_admin ? navigate("/admin") : navigate("/");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.post("http://127.0.0.1:8000/api/auth/google/", {
        token: credentialResponse.credential,
      });
      googleLogin(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!Authloading && user) {
    if (user.is_admin || user.is_superuser) {
      navigate("/admin/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }
}, [user, Authloading, navigate]);


  return (
    
    <div className={`min-h-screen flex flex-col items-center justify-center transition-all duration-1000 relative z-0 py-20 lg:py-32 ${isRevealed ? "bg-[#fafafa]" : "bg-[#ececec]"}`}>
      <style>
        {`
          @keyframes curvy-flicker {
            0% { opacity: 0; transform: translateY(10px); }
            15% { opacity: 0.4; }
            30% { opacity: 0.2; }
            45% { opacity: 0.8; }
            100% { opacity: 1; transform: translateY(0); }
          }
          .curvy-reveal {
            animation: ${hasFlickered ? "curvy-flicker 0.7s ease-out forwards" : "none"};
          }
          .glass-card {
            border-radius: 80px 10px 80px 10px;
          }
          .curvy-img {
            border-radius: 70px 0px 180px 0px;
          }
        `}
      </style>

     
      <div className={`w-full max-w-[850px] flex flex-col md:flex-row min-h-[550px] bg-white glass-card shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden mx-4 transition-all duration-700 ${isRevealed ? "opacity-100" : "opacity-0 translate-y-4"}`}>
        
       
        <div className="hidden md:block w-5/12 p-3">
          <div className="w-full h-full relative curvy-img overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80" 
              alt="Golden Luxury Chandelier"
              className={`w-full h-full object-cover transition-transform duration-[3000ms] ${isRevealed ? "scale-100" : "scale-125"}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#AF8F42]/40 to-transparent mix-blend-overlay"></div>
          </div>
        </div>

        
        <div className={`w-full md:w-7/12 p-8 md:p-16 flex flex-col justify-center ${isRevealed ? "curvy-reveal" : "opacity-0"}`}>
          <div className="mb-8 text-center md:text-left">
            <span className="text-[8px] tracking-[0.5em] text-[#AF8F42] uppercase font-bold">Authentication</span>
            <h2 className="text-4xl font-light text-gray-800 mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>Welcome</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-gray-400 ml-4">Email</label>
              <input
                type="email"
                placeholder="EX: CLIENT@BRIGHTIQUE.COM"
                className="w-full bg-gray-50 rounded-full px-6 py-4 text-[10px] outline-none border border-transparent focus:border-[#AF8F42]/20 focus:bg-white transition-all tracking-[0.1em]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-widest text-gray-400 ml-4">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-gray-50 rounded-full px-6 py-4 text-[10px] outline-none border border-transparent focus:border-[#AF8F42]/20 focus:bg-white transition-all tracking-[0.2em]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end pr-4">
                <Link to="/forgot-password" size="sm" className="text-[9px] uppercase tracking-widest text-gray-300 hover:text-[#AF8F42] transition-colors">
                  Forgotten?
                </Link>
              </div>
            </div>

            {error && <p className="text-red-400 text-[9px] uppercase tracking-widest text-center italic animate-pulse">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a1a1a] text-white text-[10px] tracking-[0.4em] uppercase font-bold py-5 rounded-full hover:bg-[#AF8F42] shadow-2xl hover:shadow-[#AF8F42]/30 transition-all duration-500 mt-2"
            >
              {loading ? "Verifying..." : "Enter Boutique"}
            </button>
          </form>

          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="w-full flex items-center gap-4">
              <div className="h-[1px] flex-grow bg-gray-100"></div>
              <span className="text-[8px] text-gray-300 uppercase tracking-[0.3em]">Social Entry</span>
              <div className="h-[1px] flex-grow bg-gray-100"></div>
            </div>

            <div className="scale-90 flex flex-col items-center gap-4">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError("Google login failed")}
                shape="pill" 
              />
              <Link to="/signup" className="text-[9px] tracking-[0.2em] text-gray-400 uppercase font-bold hover:text-gray-900 transition-colors mt-2">
                Create Account <span className="text-[#AF8F42] ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
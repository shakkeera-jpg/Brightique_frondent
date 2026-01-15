import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../Context/UserContext";

export default function Signup() {
  const { signup , user,Authloading} = useContext(AuthContext);
  const navigate = useNavigate();

  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (!Authloading && user) {
      navigate("/products", { replace: true });
    }
  }, [user, Authloading, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => setIsRevealed(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;


  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number and special character"
      );
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await signup(name.trim(), email.trim(), password);

    if (result.success) {
      navigate("/login", {
        state: { successMessage: "Account created successfully!" },
      });
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-all duration-1000 relative z-0 py-20 lg:py-32 ${isRevealed ? "bg-[#fcfcfc]" : "bg-[#f0f0f0]"}`}>
      <style>
        {`
          .glass-card { border-radius: 60px 15px 60px 15px; }
          .curvy-img-wrap { border-radius: 0px 50px 0px 160px; }
          .gold-shadow { box-shadow: 0 20px 50px rgba(175, 143, 66, 0.15); }
        `}
      </style>

      
      <div className={`w-full max-w-[900px] flex flex-col md:flex-row min-h-[580px] bg-white glass-card shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden mx-4 transition-all duration-1000 ${isRevealed ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>

        
        <div className="w-full md:w-7/12 p-12 md:p-16 flex flex-col justify-center order-2 md:order-1">
          <div className="mb-10">
            <span className="text-[8px] tracking-[0.5em] text-[#AF8F42] uppercase font-bold">Registration</span>
            <h2 className="text-4xl font-light text-gray-900 mt-2" style={{ fontFamily: "'Playfair Display', serif" }}>Create Account</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group relative border-b border-gray-100 pb-2 focus-within:border-[#AF8F42] transition-colors">
              <label className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Full Name</label>
              <input
                type="text"
                placeholder="YOUR NAME"
                className="w-full bg-transparent pt-1 text-xs outline-none placeholder:text-gray-200 tracking-wider"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="group relative border-b border-gray-100 pb-2 focus-within:border-[#AF8F42] transition-colors">
              <label className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Email Address</label>
              <input
                type="email"
                placeholder="EMAIL@EXAMPLE.COM"
                className="w-full bg-transparent pt-1 text-xs outline-none placeholder:text-gray-200 tracking-wider"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="group relative border-b border-gray-100 pb-2 focus-within:border-[#AF8F42] transition-colors">
              <label className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Secret Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent pt-1 text-xs outline-none placeholder:text-gray-200 tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="group relative border-b border-gray-100 pb-2 focus-within:border-[#AF8F42] transition-colors">
              <label className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-transparent pt-1 text-xs outline-none placeholder:text-gray-200 tracking-widest"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>


            {error && <p className="text-red-500 text-[9px] tracking-widest uppercase text-center italic">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-full text-[10px] tracking-[0.4em] uppercase font-bold bg-[#AF8F42] text-white shadow-lg shadow-[#AF8F42]/30 hover:bg-[#967b38] transition-all duration-500 active:scale-95"
            >
              {loading ? "Registering..." : "Join Collection"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">
              Already a member?
              <Link to="/login" className="text-gray-900 font-bold hover:text-[#AF8F42] transition-colors ml-2">
                Sign In →
              </Link>
            </p>
          </div>
        </div>

        
        <div className="hidden md:block w-5/12 p-4 order-1 md:order-2">
          <div className="w-full h-full relative curvy-img-wrap overflow-hidden gold-shadow">
            <img
              src="https://images.unsplash.com/photo-1542728928-1413d1894ed1?auto=format&fit=crop&q=80&w=800"
              alt="Premium Designer Light"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[5000ms] hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#AF8F42]/10 to-black/40"></div>
          </div>
        </div>

      </div>
    </div>
  );
}
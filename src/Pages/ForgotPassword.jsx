import React, { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/password-reset/", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#FDFDFD] p-6">
      <div className="bg-white p-12 shadow-sm rounded-[2.5rem] w-full max-w-[440px] border border-gray-100 animate-in fade-in zoom-in duration-500">
        
        
        <div className="mb-10 text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#AF8F42] mb-3 font-bold">Account Recovery</p>
          <h2 className="text-3xl font-serif text-gray-900 tracking-tight">Recover Access</h2>
          <div className="h-px w-10 bg-gray-100 mx-auto mt-5" />
        </div>
        
       
        {message && (
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-5 py-4 rounded-2xl mb-8 text-[11px] font-bold uppercase tracking-wider text-center">
            {message}
          </div>
        )}

        
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-5 py-4 rounded-2xl mb-8 text-[11px] font-bold uppercase tracking-wider text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div>
            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">
              Registered Email
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="CLIENT@EXAMPLE.COM"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-[12px] text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#AF8F42] focus:bg-white transition-all tracking-widest"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="absolute right-4 top-4 text-[#AF8F42]/40">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
            <p className="text-[9px] text-gray-400 mt-3 ml-1 tracking-wide leading-relaxed">
              We will transmit a secure recovery link to your inbox.
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#AF8F42] text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#967a38] transition-all shadow-lg shadow-[#AF8F42]/20 active:scale-[0.98]"
          >
            Request Link
          </button>
        </form>
        
        <div className="mt-12 pt-8 border-t border-gray-50 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
            Identity remembered?{" "}
            <a href="/login" className="font-bold text-[#AF8F42] hover:text-[#967a38] transition-colors ml-1">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
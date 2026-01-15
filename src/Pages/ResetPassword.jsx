import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`http://127.0.0.1:8000/api/password-reset-confirm/${uid}/${token}/`, { password });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FDFDFD] p-6">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-gray-100 w-full max-w-md animate-in fade-in zoom-in duration-500">
        
        {/* --- Brand Header --- */}
        <div className="mb-10 text-center">
          <p className="text-[10px] tracking-[0.5em] uppercase text-[#AF8F42] mb-3 font-bold">Security Portal</p>
          <h1 className="text-3xl font-serif text-gray-900 mb-2">Reset Password</h1>
          <div className="h-px w-12 bg-gray-100 mx-auto mt-4" />
        </div>

        {/* --- Success Notification --- */}
        {message && (
          <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-[11px] font-bold uppercase tracking-wider text-center">
            <p>{message}</p>
            <p className="text-[9px] mt-1 opacity-70 italic font-normal">Redirecting to login...</p>
          </div>
        )}

        {/* --- Error Notification --- */}
        {error && (
          <div className="mb-8 p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-[11px] font-bold uppercase tracking-wider text-center">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">
              New Credentials
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="ENTER NEW PASSWORD"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 text-[12px] text-gray-800 placeholder-gray-300 focus:outline-none focus:border-[#AF8F42] focus:bg-white transition-all tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="absolute right-4 top-4 text-[#AF8F42]/40">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <p className="text-[9px] text-gray-400 mt-3 ml-1 tracking-wide leading-relaxed">
              Requirement: Minimum 8 characters including alphanumerics.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#AF8F42] text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#967a38] transition-all shadow-lg shadow-[#AF8F42]/20 active:scale-[0.98]"
          >
            Update Archive
          </button>
        </form>

        <div className="mt-12 pt-8 border-t border-gray-50 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">
            Return to security?{" "}
            <a href="/login" className="font-bold text-[#AF8F42] hover:text-[#967a38] transition-colors ml-1">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
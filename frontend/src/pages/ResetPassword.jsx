import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { API_URL } from '../config.js';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/reset-password/${token}/`,
        { password }
      );

      setMessage(res.data.message || "Password reset successful!");
      
      // Redirect to login after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid or expired token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Set New Password
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Please choose a strong password you haven't used before.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-all ${
                  confirmPassword && password !== confirmPassword 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-green-500"
                }`}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (password !== confirmPassword && confirmPassword !== "")}
            className={`w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white shadow-sm transition-all
              ${loading ? "bg-gray-400 cursor-wait" : "bg-green-600 hover:bg-green-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"}`}
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>


       {message && (
          <div className={`mt-6 p-4 rounded-lg text-center text-sm font-semibold animate-pulse
            ${message.includes("match") || message.includes("expired") 
              ? "bg-red-50 text-red-700 border border-red-100" 
              : "bg-blue-50 text-blue-700 border border-blue-100"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

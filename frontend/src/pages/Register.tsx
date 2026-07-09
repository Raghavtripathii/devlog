import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/api";
import type { Token } from "../types";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", { username, email, password });
      // Auto-login after registration so they don't have to log in manually
      const res = await api.post<Token>("/auth/login", { email, password });
      await login(res.data.access_token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-4xl">📓</span>
          <h1 className="text-2xl font-semibold mt-2 text-white">Create your DevLog</h1>
          <p className="text-surface-100/60 text-sm mt-1">Start tracking your coding journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-surface-100/70 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              maxLength={50}
              className="w-full bg-surface-900 border border-surface-800 rounded-lg px-4 py-2.5 text-white placeholder-surface-100/30 focus:outline-none focus:border-accent-500 transition-colors"
              placeholder="raghav"
            />
          </div>

          <div>
            <label className="block text-sm text-surface-100/70 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-surface-900 border border-surface-800 rounded-lg px-4 py-2.5 text-white placeholder-surface-100/30 focus:outline-none focus:border-accent-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-surface-100/70 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full bg-surface-900 border border-surface-800 rounded-lg px-4 py-2.5 text-white placeholder-surface-100/30 focus:outline-none focus:border-accent-500 transition-colors"
              placeholder="min. 8 characters"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-surface-100/50 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-accent-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
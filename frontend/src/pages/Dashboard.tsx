import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import type { Session, WeeklyRecap } from "../types";
import { SessionForm } from "../components/SessionForm";
import { Heatmap } from "../components/Heatmap";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const { data: sessions = [] } = useQuery<Session[]>({
    queryKey: ["sessions"],
    queryFn: () => api.get("/sessions/").then((r) => r.data),
  });

  const { data: recap } = useQuery<WeeklyRecap>({
    queryKey: ["recap"],
    queryFn: () => api.get("/sessions/recap/weekly").then((r) => r.data),
    staleTime: 1000 * 60 * 10, // cache for 10 minutes — no need to hit Gemini every render
  });

  const totalHours = sessions.reduce((sum, s) => sum + s.hours, 0);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-surface-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">📓</span>
          <div>
            <h1 className="font-semibold text-white text-sm">DevLog</h1>
            <p className="text-xs text-surface-100/50">@{user?.username}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/u/${user?.username}`)}
            className="text-xs text-surface-100/60 hover:text-white transition-colors"
          >
            Public profile
          </button>
          <button
            onClick={handleLogout}
            className="text-xs text-surface-100/60 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total hours", value: totalHours },
            { label: "Sessions logged", value: sessions.length },
            { label: "This week", value: recap?.total_hours ?? 0 },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-900 border border-surface-800 rounded-xl p-4">
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
              <p className="text-xs text-surface-100/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div className="bg-surface-900 border border-surface-800 rounded-xl p-6">
          <Heatmap sessions={sessions} />
        </div>

        {/* AI Recap */}
        {recap?.recap && (
          <div className="bg-surface-900 border border-accent-500/30 rounded-xl p-6">
            <p className="text-xs text-accent-400 font-medium mb-2">AI Weekly Recap</p>
            <p className="text-surface-100/80 text-sm leading-relaxed">{recap.recap}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Session log form */}
          <SessionForm />

          {/* Recent sessions */}
          <div className="space-y-3">
            <h2 className="font-semibold text-white">Recent sessions</h2>
            {sessions.length === 0 && (
              <p className="text-surface-100/40 text-sm">No sessions yet. Log your first one!</p>
            )}
            {sessions.slice(0, 8).map((s) => (
              <div key={s.id} className="bg-surface-900 border border-surface-800 rounded-lg px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-accent-400">{s.language}</span>
                  <span className="text-xs text-surface-100/50">{s.hours}h · mood {s.mood}/5</span>
                </div>
                <p className="text-sm text-surface-100/70 line-clamp-2">{s.what_i_built}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../lib/api";
import { Heatmap } from "../components/Heatmap";

interface ProfileData {
  username: string;
  member_since: string;
  total_hours: number;
  total_sessions: number;
  recent_sessions: any[];
}

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();

  const { data, isLoading, isError } = useQuery<ProfileData>({
    queryKey: ["profile", username],
    queryFn: () => api.get(`/profile/${username}`).then((r) => r.data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-surface-100/50">Profile not found.</p>
      </div>
    );
  }

  const joinYear = new Date(data.member_since).getFullYear();

  return (
    <div className="min-h-screen">
      <header className="border-b border-surface-800 px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">📓</span>
          <span className="font-semibold text-white text-sm">DevLog</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">@{data.username}</h1>
          <p className="text-surface-100/50 text-sm mt-1">Member since {joinYear}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-surface-900 border border-surface-800 rounded-xl p-4">
            <p className="text-3xl font-semibold text-white">{data.total_hours}</p>
            <p className="text-xs text-surface-100/50 mt-1">Total hours logged</p>
          </div>
          <div className="bg-surface-900 border border-surface-800 rounded-xl p-4">
            <p className="text-3xl font-semibold text-white">{data.total_sessions}</p>
            <p className="text-xs text-surface-100/50 mt-1">Sessions logged</p>
          </div>
        </div>

        <div className="bg-surface-900 border border-surface-800 rounded-xl p-6">
          <Heatmap sessions={data.recent_sessions} />
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold text-white">Recent sessions</h2>
          {data.recent_sessions.map((s: any) => (
            <div key={s.id} className="bg-surface-900 border border-surface-800 rounded-lg px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-accent-400">{s.language}</span>
                <span className="text-xs text-surface-100/50">{s.hours}h</span>
              </div>
              <p className="text-sm text-surface-100/70">{s.what_i_built}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
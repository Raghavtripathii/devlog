// The form users fill in to log a new coding session.

import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../lib/api";
import type { Session, SessionCreateInput } from "../types";

const LANGUAGES = ["JavaScript", "TypeScript", "Python", "React", "CSS", "HTML", "Java", "Go", "Rust", "Other"];
const MOODS = [
  { value: 1, label: "Rough" },
  { value: 2, label: "Meh" },
  { value: 3, label: "Okay" },
  { value: 4, label: "Good" },
  { value: 5, label: "Great" },
];

export function SessionForm() {
  const queryClient = useQueryClient();

  const [language, setLanguage] = useState("TypeScript");
  const [hours, setHours] = useState(1);
  const [whatIBuilt, setWhatIBuilt] = useState("");
  const [mood, setMood] = useState(3);

  const mutation = useMutation({
    mutationFn: (data: SessionCreateInput) => api.post<Session>("/sessions/", data),
    onSuccess: () => {
      // Tell React Query to re-fetch the sessions list after a successful log
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      setWhatIBuilt("");
      setHours(1);
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    mutation.mutate({ language, hours, what_i_built: whatIBuilt, mood });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-900 border border-surface-800 rounded-xl p-6 space-y-4">
      <h2 className="font-semibold text-white">Log a session</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-surface-100/60 mb-1">Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-surface-800 border border-surface-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-500"
          >
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs text-surface-100/60 mb-1">Hours</label>
          <input
            type="number"
            min={1}
            max={16}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full bg-surface-800 border border-surface-800 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-surface-100/60 mb-1">What did you build?</label>
        <textarea
          value={whatIBuilt}
          onChange={(e) => setWhatIBuilt(e.target.value)}
          required
          rows={3}
          placeholder="Describe what you worked on today..."
          className="w-full bg-surface-800 border border-surface-800 rounded-lg px-3 py-2 text-white text-sm placeholder-surface-100/30 focus:outline-none focus:border-accent-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs text-surface-100/60 mb-2">How was it?</label>
        <div className="flex gap-2">
          {MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value)}
              className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                mood === m.value
                  ? "bg-accent-500 border-accent-500 text-white"
                  : "bg-surface-800 border-surface-800 text-surface-100/60 hover:border-accent-500/50"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {mutation.isError && (
        <p className="text-red-400 text-sm">Failed to log session. Try again.</p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-accent-500 hover:bg-accent-600 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
      >
        {mutation.isPending ? "Logging..." : "Log session"}
      </button>
    </form>
  );
}
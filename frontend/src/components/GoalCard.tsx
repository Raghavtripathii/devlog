// Displays a single weekly goal with a progress bar.
import type { Goal, Session } from "../types";

interface Props {
  goal: Goal;
  sessions: Session[];
}

export function GoalCard({ goal, sessions }: Props) {
  const weekStart = new Date(goal.week_start);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 7);

  // Only count sessions that happened during this goal's week
  const logged = sessions
    .filter((s) => {
      const d = new Date(s.logged_at);
      return d >= weekStart && d < weekEnd;
    })
    .reduce((sum, s) => sum + s.hours, 0);

  const pct = Math.min(100, Math.round((logged / goal.target_hours) * 100));

  return (
    <div className="bg-surface-900 border border-surface-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-white">{goal.title}</p>
        <span className="text-xs text-accent-400 font-medium">{pct}%</span>
      </div>

      <div className="w-full h-1.5 bg-surface-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-accent-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="text-xs text-surface-100/50 mt-2">
        {logged} / {goal.target_hours} hours · week of{" "}
        {weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
      </p>
    </div>
  );
}
import type { Session } from "../types";
interface Props {
  sessions: Session[];
}

export function Heatmap({ sessions }: Props) {
  // Build a map of date → total hours for that day
  const hoursByDate: Record<string, number> = {};
  sessions.forEach((s) => {
    const date = s.logged_at.split("T")[0];
    hoursByDate[date] = (hoursByDate[date] ?? 0) + s.hours;
  });

  // Generate the last 16 weeks of dates (112 days)
  const today = new Date();
  const days: Date[] = [];
  for (let i = 111; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }

  const getColor = (hours: number) => {
    if (hours === 0) return "#1a1a2e";
    if (hours <= 1) return "#312e81";
    if (hours <= 3) return "#4338ca";
    if (hours <= 5) return "#6366f1";
    return "#818cf8";
  };

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-surface-100/70 mb-3">Activity (last 16 weeks)</h3>
      <div className="flex gap-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((day) => {
              const key = day.toISOString().split("T")[0];
              const h = hoursByDate[key] ?? 0;
              return (
                <div
                  key={key}
                  className="w-3 h-3 rounded-sm cursor-default"
                  style={{ background: getColor(h) }}
                  title={`${key}: ${h}h`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1 mt-2">
        <span className="text-xs text-surface-100/40">Less</span>
        {[0, 1, 3, 5, 8].map((h) => (
          <div key={h} className="w-3 h-3 rounded-sm" style={{ background: getColor(h) }} />
        ))}
        <span className="text-xs text-surface-100/40">More</span>
      </div>
    </div>
  );
}
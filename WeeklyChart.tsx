import { ActivityType, ACTIVITY_META } from '../types';
import { getLast7Days, shortDayLabel, isToday, formatDurationHHMM } from '../utils/timeUtils';

interface DaySummary {
  date: string;
  totals: Record<ActivityType, number>;
}

interface Props {
  weeklySummary: Record<string, DaySummary>;
}

const TYPES_STACKED: ActivityType[] = ['working', 'meeting', 'lunch', 'break'];

const COLORS: Record<ActivityType, string> = {
  working: '#7c3aed',
  meeting: '#3b82f6',
  lunch:   '#f59e0b',
  break:   '#10b981',
  idle:    '#64748b',
};

const TARGET_MS = 8 * 3600 * 1000;

export default function WeeklyChart({ weeklySummary }: Props) {
  const days = getLast7Days();

  // Find the max total (working + meeting) across days for bar scaling
  let maxMs = TARGET_MS;
  for (const dateKey of days) {
    const s = weeklySummary[dateKey];
    if (s) {
      const total = s.totals.working + s.totals.meeting + s.totals.lunch + s.totals.break;
      if (total > maxMs) maxMs = total;
    }
  }

  // Weekly totals
  let weeklyActive = 0;
  let weeklyMeeting = 0;
  let weeklyBreak = 0;
  for (const dateKey of days) {
    const s = weeklySummary[dateKey];
    if (s) {
      weeklyActive += s.totals.working + s.totals.meeting;
      weeklyMeeting += s.totals.meeting;
      weeklyBreak += s.totals.lunch + s.totals.break;
    }
  }
  const avgActive = weeklyActive / 7;

  function formatH(ms: number) {
    const h = (ms / 3600000).toFixed(1);
    return `${h}h`;
  }

  return (
    <div className="space-y-5">

      {/* Weekly summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-xl p-4 border border-violet-500/30 text-center">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Week Active</p>
          <p className="text-xl font-bold text-violet-400 font-display">{formatH(weeklyActive)}</p>
        </div>
        <div className="glass rounded-xl p-4 border border-blue-500/30 text-center">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Avg / Day</p>
          <p className="text-xl font-bold text-blue-400 font-display">{formatH(avgActive)}</p>
        </div>
        <div className="glass rounded-xl p-4 border border-emerald-500/30 text-center">
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">In Meetings</p>
          <p className="text-xl font-bold text-emerald-400 font-display">{formatH(weeklyMeeting)}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="glass rounded-2xl border border-white/08 p-5">
        <div className="flex items-end justify-between mb-1">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">7-Day Overview</h3>
          <span className="text-xs text-white/30">8h target line</span>
        </div>

        <div className="mt-4 relative">
          {/* Target line at ~75% of chart height (which represents ~100% of 8h) */}
          <div
            className="absolute left-0 right-0 border-t border-dashed border-violet-500/40 z-10"
            style={{ bottom: `${(TARGET_MS / maxMs) * 180}px` }}
          >
            <span className="absolute right-0 -top-3 text-[10px] text-violet-400/60">8h</span>
          </div>

          <div className="flex items-end gap-2 h-[180px]">
            {days.map(dateKey => {
              const s = weeklySummary[dateKey];
              const totals = s?.totals ?? { working: 0, meeting: 0, lunch: 0, break: 0, idle: 0 };
              const grandTotal = TYPES_STACKED.reduce((a, t) => a + totals[t], 0);
              const barHeightPct = maxMs > 0 ? (grandTotal / maxMs) * 100 : 0;
              const isT = isToday(dateKey);

              return (
                <div key={dateKey} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                  {/* Tooltip */}
                  {grandTotal > 0 && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 glass rounded-lg p-2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 border border-white/10 pointer-events-none">
                      <p className="text-white font-semibold mb-1">{shortDayLabel(dateKey)}</p>
                      {TYPES_STACKED.map(t => totals[t] > 0 && (
                        <div key={t} className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: COLORS[t] }} />
                          <span className="text-white/60">{ACTIVITY_META[t].label}:</span>
                          <span className="text-white">{formatDurationHHMM(totals[t])}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Stacked bar */}
                  <div
                    className={`w-full rounded-t-lg overflow-hidden flex flex-col-reverse transition-all duration-700 ${isT ? 'ring-1 ring-violet-400/50' : ''}`}
                    style={{ height: `${Math.max(barHeightPct, grandTotal > 0 ? 2 : 0)}%` }}
                  >
                    {TYPES_STACKED.map(t => {
                      const dur = totals[t];
                      if (dur <= 0 || grandTotal <= 0) return null;
                      const segPct = (dur / grandTotal) * 100;
                      return (
                        <div
                          key={t}
                          className="w-full flex-shrink-0"
                          style={{ height: `${segPct}%`, background: COLORS[t], opacity: 0.85 }}
                        />
                      );
                    })}
                  </div>

                  {grandTotal === 0 && (
                    <div className="w-full h-1 rounded-full bg-white/10" />
                  )}

                  {/* Day label */}
                  <p className={`mt-2 text-xs font-medium ${isT ? 'text-violet-400' : 'text-white/40'}`}>
                    {shortDayLabel(dateKey)}
                  </p>
                  {grandTotal > 0 && (
                    <p className="text-[10px] text-white/25 font-mono">{formatDurationHHMM(totals.working + totals.meeting)}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 pt-4 border-t border-white/08">
          {TYPES_STACKED.map(t => (
            <div key={t} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm" style={{ background: COLORS[t] }} />
              <span className="text-xs text-white/40">{ACTIVITY_META[t].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Day-by-day breakdown table */}
      <div className="glass rounded-2xl border border-white/08 overflow-hidden">
        <div className="px-5 py-3 border-b border-white/08">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Daily Breakdown</h3>
        </div>
        <div className="divide-y divide-white/05">
          {days.map(dateKey => {
            const s = weeklySummary[dateKey];
            const totals = s?.totals ?? { working: 0, meeting: 0, lunch: 0, break: 0, idle: 0 };
            const active = totals.working + totals.meeting;
            const isT = isToday(dateKey);
            const d = new Date(dateKey + 'T00:00:00');
            const label = d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
            const pct = Math.min((active / TARGET_MS) * 100, 100);

            return (
              <div key={dateKey} className={`px-5 py-3 ${isT ? 'bg-violet-500/05' : ''}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <p className={`text-sm font-medium ${isT ? 'text-violet-300' : 'text-white/70'}`}>
                    {label} {isT && <span className="text-xs text-violet-400/70 ml-1">Today</span>}
                  </p>
                  <p className="text-sm font-mono text-white/70">{active > 0 ? formatDurationHHMM(active) : '—'}</p>
                </div>
                {active > 0 && (
                  <div className="h-1.5 bg-white/08 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

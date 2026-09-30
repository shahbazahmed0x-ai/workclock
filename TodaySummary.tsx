import { Session, ACTIVITY_META, ActivityType } from '../types';
import { formatDuration, formatTime } from '../utils/timeUtils';

interface Props {
  sessions: Session[];
  durations: Record<ActivityType, number>;
  totalActive: number;
  totalBreak: number;
  now: number;
}

const TARGET_HOURS = 8 * 3600 * 1000; // 8 hours in ms

export default function TodaySummary({ sessions, durations, totalActive, totalBreak, now }: Props) {
  const progress = Math.min((totalActive / TARGET_HOURS) * 100, 100);

  const breakdownTypes: ActivityType[] = ['working', 'meeting', 'lunch', 'break'];

  // Compute bar widths relative to totalActive + totalBreak
  const grandTotal = totalActive + totalBreak;

  // Recent sessions (last 8)
  const recent = [...sessions].reverse().slice(0, 8);

  return (
    <div className="space-y-5">

      {/* Progress toward 8h goal */}
      <div className="glass rounded-2xl p-5 border border-white/08 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest font-medium">Daily Goal Progress</p>
            <p className="text-2xl font-bold text-white font-display mt-0.5">
              {formatDuration(totalActive)}
              <span className="text-sm text-white/30 font-normal ml-1">/ 8h target</span>
            </p>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold font-display ${progress >= 100 ? 'text-emerald-400' : 'text-violet-400'}`}>
              {Math.round(progress)}%
            </p>
            {progress < 100 && (
              <p className="text-xs text-white/30">
                {formatDuration(Math.max(0, TARGET_HOURS - totalActive))} left
              </p>
            )}
            {progress >= 100 && (
              <p className="text-xs text-emerald-400">Goal reached! 🎉</p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 bg-white/10 rounded-full overflow-hidden relative">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 bar-fill relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 shimmer" />
          </div>
        </div>

        {/* Stacked activity bar */}
        {grandTotal > 0 && (
          <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
            {breakdownTypes.map(type => {
              const dur = durations[type];
              if (dur <= 0) return null;
              const w = (dur / grandTotal) * 100;
              const gradients: Record<ActivityType, string> = {
                working: 'bg-violet-500',
                meeting: 'bg-blue-500',
                lunch: 'bg-amber-500',
                break: 'bg-emerald-500',
                idle: 'bg-slate-500',
              };
              return (
                <div
                  key={type}
                  className={`h-full ${gradients[type]} bar-fill`}
                  style={{ width: `${w}%` }}
                  title={`${ACTIVITY_META[type].label}: ${formatDuration(dur)}`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {breakdownTypes.map(type => {
          const meta = ACTIVITY_META[type];
          const dur = durations[type];
          return (
            <div key={type} className={`glass rounded-xl p-4 border ${meta.border} flex items-center gap-3`}>
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-lg flex-shrink-0`}>
                {meta.icon}
              </div>
              <div className="min-w-0">
                <p className={`text-xs ${meta.textColor} font-medium uppercase tracking-wide`}>{meta.label}</p>
                <p className="text-lg font-bold text-white font-display truncate">{formatDuration(dur)}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Session log */}
      {recent.length > 0 && (
        <div className="glass rounded-2xl border border-white/08 overflow-hidden">
          <div className="px-5 py-3 border-b border-white/08">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Recent Sessions</h3>
          </div>
          <div className="divide-y divide-white/05">
            {recent.map(s => {
              const meta = ACTIVITY_META[s.type];
              const end = s.endTime ?? now;
              const dur = end - s.startTime;
              return (
                <div key={s.id} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-lg">{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${meta.textColor}`}>{meta.label}</p>
                    <p className="text-xs text-white/30">
                      {formatTime(s.startTime)} → {s.endTime ? formatTime(s.endTime) : 'ongoing'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-white/70">{formatDuration(dur)}</p>
                    {!s.endTime && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                        live
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {recent.length === 0 && (
        <div className="glass rounded-2xl border border-white/08 p-8 text-center">
          <p className="text-3xl mb-2">🌅</p>
          <p className="text-white/40 text-sm">No sessions yet today. Start tracking!</p>
        </div>
      )}
    </div>
  );
}

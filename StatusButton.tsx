import { ActivityType, ACTIVITY_META } from '../types';

interface Props {
  type: ActivityType;
  isActive: boolean;
  onClick: () => void;
  duration: number;
}

function formatDur(ms: number) {
  if (ms <= 0) return '—';
  const totalMin = Math.floor(ms / 60000);
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h > 0) return `${h}h ${m}m`;
  const s = Math.floor((ms % 60000) / 1000);
  if (totalMin > 0) return `${totalMin}m ${s}s`;
  return `${s}s`;
}

export default function StatusButton({ type, isActive, onClick, duration }: Props) {
  const meta = ACTIVITY_META[type];

  return (
    <button
      onClick={onClick}
      className={`
        btn-lift relative group flex flex-col items-center justify-center gap-2
        px-4 py-5 rounded-2xl border text-center w-full
        transition-all duration-200 cursor-pointer overflow-hidden
        ${isActive
          ? `bg-gradient-to-br ${meta.color} border-transparent ${meta.glow} shadow-2xl scale-[1.03]`
          : `glass ${meta.border} hover:${meta.bg}`
        }
      `}
    >
      {/* Active ring pulse */}
      {isActive && (
        <span className="absolute inset-0 rounded-2xl border-2 border-white/30 pulse-ring pointer-events-none" />
      )}

      {/* Shimmer on hover when inactive */}
      {!isActive && (
        <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shimmer rounded-2xl" />
      )}

      {/* Icon */}
      <span className="text-3xl leading-none z-10">{meta.icon}</span>

      {/* Label */}
      <span className={`text-sm font-semibold z-10 ${isActive ? 'text-white' : 'text-white/80'}`}>
        {meta.label}
      </span>

      {/* Duration */}
      <span className={`text-xs font-mono z-10 ${isActive ? 'text-white/80' : meta.textColor}`}>
        {formatDur(duration)}
      </span>

      {/* Active indicator dot */}
      {isActive && (
        <span className="absolute top-3 right-3 h-2 w-2 rounded-full bg-white shadow-lg z-10" />
      )}
    </button>
  );
}

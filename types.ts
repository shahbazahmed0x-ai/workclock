export type ActivityType = 'working' | 'meeting' | 'lunch' | 'break' | 'idle';

export interface Session {
  id: string;
  type: ActivityType;
  startTime: number; // epoch ms
  endTime: number | null;
  label: string;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  sessions: Session[];
}

export interface WeekData {
  [date: string]: DayRecord;
}

export const ACTIVITY_META: Record<ActivityType, {
  label: string;
  color: string;
  bg: string;
  border: string;
  glow: string;
  icon: string;
  textColor: string;
}> = {
  working: {
    label: 'Working',
    color: 'from-violet-500 to-indigo-600',
    bg: 'bg-violet-500/20',
    border: 'border-violet-500/50',
    glow: 'glow-purple',
    icon: '💼',
    textColor: 'text-violet-300',
  },
  meeting: {
    label: 'Meeting',
    color: 'from-blue-500 to-cyan-500',
    bg: 'bg-blue-500/20',
    border: 'border-blue-500/50',
    glow: 'glow-blue',
    icon: '🤝',
    textColor: 'text-blue-300',
  },
  lunch: {
    label: 'Lunch Break',
    color: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-500/20',
    border: 'border-amber-500/50',
    glow: 'glow-amber',
    icon: '🍽️',
    textColor: 'text-amber-300',
  },
  break: {
    label: 'Small Break',
    color: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-500/20',
    border: 'border-emerald-500/50',
    glow: 'glow-green',
    icon: '☕',
    textColor: 'text-emerald-300',
  },
  idle: {
    label: 'Idle',
    color: 'from-slate-500 to-slate-600',
    bg: 'bg-slate-500/20',
    border: 'border-slate-500/50',
    glow: '',
    icon: '⏸️',
    textColor: 'text-slate-400',
  },
};

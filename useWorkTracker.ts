import { useState, useEffect, useCallback, useRef } from 'react';
import { ActivityType, Session, DayRecord, WeekData } from '../types';
import { todayKey } from '../utils/timeUtils';

const STORAGE_KEY = 'workclock_data_v2';

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadData(): WeekData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as WeekData;
  } catch {}
  return {};
}

function saveData(data: WeekData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getTodayRecord(data: WeekData): DayRecord {
  const key = todayKey();
  return data[key] ?? { date: key, sessions: [] };
}

function computeDurations(sessions: Session[], now: number) {
  const totals: Record<ActivityType, number> = {
    working: 0, meeting: 0, lunch: 0, break: 0, idle: 0,
  };
  for (const s of sessions) {
    const end = s.endTime ?? now;
    const dur = Math.max(0, end - s.startTime);
    totals[s.type] += dur;
  }
  return totals;
}

export function useWorkTracker() {
  const [data, setData] = useState<WeekData>(loadData);
  const [now, setNow] = useState<number>(Date.now());
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick every second
  useEffect(() => {
    tickRef.current = setInterval(() => setNow(Date.now()), 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  const today = getTodayRecord(data);
  const currentSession = today.sessions.find(s => s.endTime === null) ?? null;
  const currentActivity: ActivityType = currentSession?.type ?? 'idle';

  const durations = computeDurations(today.sessions, now);
  const totalActive = durations.working + durations.meeting;
  const totalBreak = durations.lunch + durations.break;

  const startActivity = useCallback((type: ActivityType) => {
    setData(prev => {
      const key = todayKey();
      const record = prev[key] ?? { date: key, sessions: [] };

      // Close any open session
      const closedSessions = record.sessions.map(s =>
        s.endTime === null ? { ...s, endTime: Date.now() } : s
      );

      // If same type as current — stop (toggle off)
      const last = closedSessions[closedSessions.length - 1];
      const wasSame = last && last.type === type && last.endTime === Date.now();

      let newSessions = closedSessions;
      if (!wasSame) {
        newSessions = [...closedSessions, {
          id: generateId(),
          type,
          startTime: Date.now(),
          endTime: null,
          label: type,
        }];
      }

      const updated: WeekData = {
        ...prev,
        [key]: { ...record, sessions: newSessions },
      };
      saveData(updated);
      return updated;
    });
  }, []);

  const stopAll = useCallback(() => {
    setData(prev => {
      const key = todayKey();
      const record = prev[key];
      if (!record) return prev;
      const closed = record.sessions.map(s =>
        s.endTime === null ? { ...s, endTime: Date.now() } : s
      );
      const updated = { ...prev, [key]: { ...record, sessions: closed } };
      saveData(updated);
      return updated;
    });
  }, []);

  const resetToday = useCallback(() => {
    setData(prev => {
      const key = todayKey();
      const updated = { ...prev, [key]: { date: key, sessions: [] } };
      saveData(updated);
      return updated;
    });
  }, []);

  // Weekly summaries
  function getWeeklySummary() {
    const summary: Record<string, { date: string; totals: Record<ActivityType, number> }> = {};
    for (const [dateKey, record] of Object.entries(data)) {
      summary[dateKey] = {
        date: dateKey,
        totals: computeDurations(record.sessions, now),
      };
    }
    return summary;
  }

  return {
    today,
    currentActivity,
    currentSession,
    durations,
    totalActive,
    totalBreak,
    now,
    startActivity,
    stopAll,
    resetToday,
    weeklySummary: getWeeklySummary(),
  };
}

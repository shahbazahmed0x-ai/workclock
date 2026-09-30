import { useState } from 'react';
import { useWorkTracker } from './hooks/useWorkTracker';
import { ActivityType, ACTIVITY_META } from './types';
import Clock from './components/Clock';
import StatusButton from './components/StatusButton';
import TodaySummary from './components/TodaySummary';
import WeeklyChart from './components/WeeklyChart';
import BloggerGuide from './components/BloggerGuide';
import { formatDuration } from './utils/timeUtils';

type Tab = 'today' | 'week' | 'deploy';

const ACTIVITY_BUTTONS: ActivityType[] = ['working', 'meeting', 'lunch', 'break'];

export default function App() {
  const [tab, setTab] = useState<Tab>('today');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const {
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
    weeklySummary,
  } = useWorkTracker();

  function handleActivity(type: ActivityType) {
    if (currentActivity === type) {
      stopAll();
    } else {
      startActivity(type);
    }
  }

  const isTracking = currentActivity !== 'idle';
  const currentMeta = ACTIVITY_META[currentActivity];
  const elapsed = currentSession ? now - currentSession.startTime : 0;

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'today',  label: 'Today',    icon: '📊' },
    { id: 'week',   label: 'This Week', icon: '📅' },
    { id: 'deploy', label: 'Blogger',   icon: '📝' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] relative overflow-x-hidden">

      {/* Background blobs */}
      <div className="blob w-[600px] h-[600px] bg-violet-700 -top-60 -left-40" />
      <div className="blob w-[500px] h-[500px] bg-indigo-800 top-1/3 -right-60" />
      <div className="blob w-[400px] h-[400px] bg-blue-900 bottom-0 left-1/4" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-10 pb-24">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-violet-900/50">
              ⏱️
            </div>
            <div>
              <h1 className="font-display font-bold text-white text-lg leading-tight">WorkClock</h1>
              <p className="text-xs text-white/30">Daily hours tracker</p>
            </div>
          </div>

          {/* Status badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full glass border text-xs font-medium
            ${isTracking ? currentMeta.border : 'border-white/10'}`}>
            <span className={`h-2 w-2 rounded-full ${isTracking ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
            <span className={isTracking ? currentMeta.textColor : 'text-white/30'}>
              {isTracking ? currentMeta.label : 'Not tracking'}
            </span>
          </div>
        </header>

        {/* Clock — only show when not on deploy tab */}
        {tab !== 'deploy' && (
          <section className="mb-8">
            <Clock />
          </section>
        )}

        {/* Deploy tab header */}
        {tab === 'deploy' && (
          <div className="mb-6 text-center">
            <p className="text-xs text-white/30 uppercase tracking-widest font-medium">Step-by-Step Guide</p>
            <h2 className="font-display font-bold text-white text-2xl mt-1">Host on Blogger</h2>
          </div>
        )}

        {/* Current session banner — only on today/week tabs */}
        {tab !== 'deploy' && isTracking && (
          <div className={`mb-6 glass rounded-2xl border ${currentMeta.border} p-4 flex items-center gap-4`}>
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${currentMeta.color} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}>
              {currentMeta.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs uppercase tracking-widest font-medium ${currentMeta.textColor}`}>Currently</p>
              <p className="text-white font-semibold text-lg font-display">{currentMeta.label}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold font-mono text-white">{formatDuration(elapsed)}</p>
              <p className="text-xs text-white/30">this session</p>
            </div>
          </div>
        )}

        {/* Activity Buttons — only on today/week tabs */}
        {tab !== 'deploy' && (
          <section className="mb-8">
            <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3 pl-1">
              Select Activity — tap again to stop
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ACTIVITY_BUTTONS.map(type => (
                <StatusButton
                  key={type}
                  type={type}
                  isActive={currentActivity === type}
                  onClick={() => handleActivity(type)}
                  duration={durations[type]}
                />
              ))}
            </div>
          </section>
        )}

        {/* Stop All button */}
        {tab !== 'deploy' && isTracking && (
          <div className="mb-6 flex justify-center">
            <button
              onClick={stopAll}
              className="btn-lift glass border border-rose-500/40 text-rose-400 text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-rose-500/10 transition-colors duration-200"
            >
              ⏹ Stop Tracking
            </button>
          </div>
        )}

        {/* Tab switcher */}
        <div className="glass rounded-2xl border border-white/08 p-1.5 flex gap-1 mb-6">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === t.id
                  ? t.id === 'deploy'
                    ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-pink-900/50'
                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-900/50'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'today' && (
          <TodaySummary
            sessions={today.sessions}
            durations={durations}
            totalActive={totalActive}
            totalBreak={totalBreak}
            now={now}
          />
        )}

        {tab === 'week' && (
          <WeeklyChart weeklySummary={weeklySummary} />
        )}

        {tab === 'deploy' && (
          <BloggerGuide />
        )}

        {/* Reset today */}
        {tab === 'today' && (
          <div className="mt-8 flex justify-center">
            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="text-xs text-white/20 hover:text-white/40 transition-colors duration-200"
              >
                Reset today's data
              </button>
            ) : (
              <div className="glass rounded-xl border border-rose-500/30 p-4 text-center space-y-3">
                <p className="text-sm text-white/70">Reset all of today's tracking data?</p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => { resetToday(); setShowConfirmReset(false); }}
                    className="px-4 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 text-sm font-medium hover:bg-rose-500/30 transition-colors"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-4 py-1.5 rounded-lg glass border border-white/10 text-white/50 text-sm font-medium hover:text-white/70 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/05 bg-[#0a0f1e]/80 backdrop-blur-xl py-2 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span>🟣 Work: <strong className="text-violet-400">{formatDuration(durations.working)}</strong></span>
            <span>🔵 Meet: <strong className="text-blue-400">{formatDuration(durations.meeting)}</strong></span>
            <span>🟡 Break: <strong className="text-amber-400">{formatDuration(durations.lunch + durations.break)}</strong></span>
          </div>
          <div className="text-xs text-white/20 hidden sm:block">Data saved locally · {isTracking ? '🔴 Tracking' : '⚫ Paused'}</div>
        </div>
      </footer>
    </div>
  );
}

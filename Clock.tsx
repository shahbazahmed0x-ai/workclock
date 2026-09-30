import { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const hh = time.getHours().toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  const ss = time.getSeconds().toString().padStart(2, '0');
  const dateStr = time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-1 font-display">
        <span className="text-5xl md:text-7xl font-bold text-white tracking-tight">{hh}</span>
        <span className="text-4xl md:text-6xl font-bold text-violet-400 tick pb-1">:</span>
        <span className="text-5xl md:text-7xl font-bold text-white tracking-tight">{mm}</span>
        <span className="text-4xl md:text-6xl font-bold text-violet-400/50 tick pb-1">:</span>
        <span className="text-3xl md:text-5xl font-semibold text-white/40 tracking-tight">{ss}</span>
      </div>
      <p className="mt-2 text-sm text-white/40 tracking-widest uppercase font-medium">{dateStr}</p>
    </div>
  );
}

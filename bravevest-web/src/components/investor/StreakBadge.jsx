import { useEffect, useState } from 'react';
import { streaksApi } from '@/api/streaks';
import './StreakBadge.css';

export default function StreakBadge() {
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    streaksApi.me().then(setStreak).catch(() => {});
  }, []);

  if (!streak || streak.currentStreak === 0) return null;

  return (
    <div className="streak">
      <div className="streak__icon">🔥</div>
      <div className="streak__content">
        <div className="streak__number">{streak.currentStreak} month{streak.currentStreak === 1 ? '' : 's'}</div>
        <div className="streak__label">Investing streak · best {streak.longestStreak}</div>
      </div>
    </div>
  );
}

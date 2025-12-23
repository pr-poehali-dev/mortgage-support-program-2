import { useEffect, useState } from 'react';

interface Theme {
  name: string;
  gradient: string;
  headerBg: string;
  primary: string;
  accent: string;
}

const themes: Theme[] = [
  {
    name: 'Синий',
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-purple-50',
    headerBg: 'bg-white/80',
    primary: 'from-blue-600 to-purple-600',
    accent: 'bg-blue-600'
  },
  {
    name: 'Зелёный',
    gradient: 'bg-gradient-to-br from-emerald-50 via-white to-teal-50',
    headerBg: 'bg-white/80',
    primary: 'from-emerald-600 to-teal-600',
    accent: 'bg-emerald-600'
  },
  {
    name: 'Оранжевый',
    gradient: 'bg-gradient-to-br from-orange-50 via-white to-amber-50',
    headerBg: 'bg-white/80',
    primary: 'from-orange-600 to-amber-600',
    accent: 'bg-orange-600'
  },
  {
    name: 'Розовый',
    gradient: 'bg-gradient-to-br from-pink-50 via-white to-rose-50',
    headerBg: 'bg-white/80',
    primary: 'from-pink-600 to-rose-600',
    accent: 'bg-pink-600'
  },
  {
    name: 'Индиго',
    gradient: 'bg-gradient-to-br from-indigo-50 via-white to-violet-50',
    headerBg: 'bg-white/80',
    primary: 'from-indigo-600 to-violet-600',
    accent: 'bg-indigo-600'
  },
  {
    name: 'Cyan',
    gradient: 'bg-gradient-to-br from-cyan-50 via-white to-sky-50',
    headerBg: 'bg-white/80',
    primary: 'from-cyan-600 to-sky-600',
    accent: 'bg-cyan-600'
  },
  {
    name: 'Фиолетовый',
    gradient: 'bg-gradient-to-br from-purple-50 via-white to-fuchsia-50',
    headerBg: 'bg-white/80',
    primary: 'from-purple-600 to-fuchsia-600',
    accent: 'bg-purple-600'
  }
];

export function useDailyTheme() {
  const [theme, setTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const themeIndex = dayOfYear % themes.length;
    
    setTheme(themes[themeIndex]);
  }, []);

  return theme;
}

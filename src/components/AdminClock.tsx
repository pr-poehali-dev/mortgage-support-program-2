import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function AdminClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const dayNames = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

  const dayName = dayNames[time.getDay()];
  const day = time.getDate();
  const month = monthNames[time.getMonth()];
  const year = time.getFullYear();

  return (
    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Icon name="Clock" size={32} className="text-white" />
            </div>
            <div>
              <div className="text-5xl font-bold tracking-tight">
                {hours}:{minutes}
                <span className="text-3xl text-white/70">:{seconds}</span>
              </div>
              <div className="text-white/90 mt-1 text-sm font-medium">
                {dayName}, {day} {month} {year}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white/80 text-xs uppercase tracking-wider mb-1">Текущее время</div>
            <div className="text-white/90 text-sm font-medium">Москва (МСК)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

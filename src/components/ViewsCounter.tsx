import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

export default function ViewsCounter() {
  const [views, setViews] = useState(0);

  useEffect(() => {
    // Начальная дата для расчета (фиксированная точка отсчета)
    const startDate = new Date('2024-12-20').getTime();
    const now = Date.now();
    
    // Определяем день в 7-дневном цикле (0-6)
    const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    const dayInCycle = daysSinceStart % 7;
    
    // Значения просмотров по дням цикла
    const viewsByDay = [
      99,   // День 0
      198,  // День 1 (99 * 2)
      297,  // День 2 (99 * 3)
      396,  // День 3 (99 * 4)
      495,  // День 4 (99 * 5, почти 500)
      297,  // День 5 (снижение)
      198   // День 6 (еще снижение, перед возвратом к 99)
    ];
    
    const targetViews = viewsByDay[dayInCycle];
    
    // Плавная анимация до целевого значения
    let currentViews = 0;
    const increment = targetViews / 50; // 50 шагов анимации
    
    const animationInterval = setInterval(() => {
      currentViews += increment;
      if (currentViews >= targetViews) {
        currentViews = targetViews;
        clearInterval(animationInterval);
      }
      setViews(Math.floor(currentViews));
    }, 30);

    return () => clearInterval(animationInterval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 py-4 px-4 bg-gradient-to-r from-primary/5 to-purple-50 rounded-lg">
      <Icon name="Eye" size={20} className="text-primary" />
      <div className="flex flex-col items-center">
        <span className="text-2xl font-bold text-primary">
          {views.toLocaleString('ru-RU')}
        </span>
        <span className="text-xs text-gray-600">
          просмотров за 7 дней
        </span>
      </div>
    </div>
  );
}

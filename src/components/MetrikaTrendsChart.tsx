import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Line } from 'react-chartjs-2';

interface DailyData {
  date: string;
  count: number;
}

interface GoalTrend {
  goal: string;
  name: string;
  color: string;
  data: DailyData[];
  total: number;
}

interface TrendsData {
  configured: boolean;
  period_days: number;
  date_from: string;
  date_to: string;
  dates: string[];
  goals: GoalTrend[];
}

export default function MetrikaTrendsChart() {
  const [trends, setTrends] = useState<TrendsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState(14);
  const [selectedGoals, setSelectedGoals] = useState<Set<string>>(new Set());

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://functions.poehali.dev/16c51e8c-714b-4cbb-955a-75003b59702a?days=${period}`
      );
      const data = await response.json();
      setTrends(data);
      
      if (data.configured && data.goals.length > 0 && selectedGoals.size === 0) {
        const topGoals = data.goals
          .sort((a: GoalTrend, b: GoalTrend) => b.total - a.total)
          .slice(0, 3)
          .map((g: GoalTrend) => g.goal);
        setSelectedGoals(new Set(topGoals));
      }
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [period]);

  const toggleGoal = (goalName: string) => {
    const newSelected = new Set(selectedGoals);
    if (newSelected.has(goalName)) {
      newSelected.delete(goalName);
    } else {
      newSelected.add(goalName);
    }
    setSelectedGoals(newSelected);
  };

  if (!trends) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="TrendingUp" className="text-primary" />
            Динамика целей
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6">
            <Icon name="Loader2" className="animate-spin text-primary" size={32} />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!trends.configured) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="TrendingUp" className="text-primary" />
            Динамика целей
          </CardTitle>
          <CardDescription>
            Требуется токен YANDEX_METRIKA_TOKEN для получения данных
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 p-6">
            <Icon name="AlertCircle" className="mx-auto mb-3" size={48} />
            <p>Настройте токен Яндекс.Метрики в разделе выше</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredGoals = trends.goals.filter(g => selectedGoals.has(g.goal));

  const chartData = {
    labels: trends.dates.map(date => {
      const d = new Date(date);
      return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    }),
    datasets: filteredGoals.map(goal => {
      const dataMap = new Map(goal.data.map(d => [d.date, d.count]));
      const values = trends.dates.map(date => dataMap.get(date) || 0);
      
      return {
        label: goal.name,
        data: values,
        borderColor: goal.color,
        backgroundColor: goal.color + '20',
        tension: 0.3,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: true,
      };
    })
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Icon name="TrendingUp" className="text-primary" />
              Динамика целей
              {loading && <Icon name="Loader2" className="animate-spin text-gray-400" size={16} />}
            </CardTitle>
            <CardDescription>
              Тренды достижения целей за {period} дней
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="h-9 px-3 border rounded-lg bg-white text-sm hover:border-primary transition-colors"
            >
              <option value="7">7 дней</option>
              <option value="14">14 дней</option>
              <option value="30">30 дней</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTrends}
              disabled={loading}
            >
              <Icon name="RefreshCw" size={14} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {trends.goals
            .sort((a, b) => b.total - a.total)
            .map((goal) => (
              <button
                key={goal.goal}
                onClick={() => toggleGoal(goal.goal)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all text-sm ${
                  selectedGoals.has(goal.goal)
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: goal.color }}
                />
                <span className="font-medium">{goal.name}</span>
                <span className={`text-xs ${selectedGoals.has(goal.goal) ? 'text-white/80' : 'text-gray-500'}`}>
                  ({goal.total})
                </span>
              </button>
            ))}
        </div>

        {filteredGoals.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <Icon name="LineChart" className="mx-auto mb-3 text-gray-300" size={48} />
            <p>Выберите цели для отображения на графике</p>
          </div>
        ) : (
          <div className="h-[400px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

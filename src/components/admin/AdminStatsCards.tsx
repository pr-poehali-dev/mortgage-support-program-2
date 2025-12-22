import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface AnalyticsTotals {
  total_views: number;
  total_applications: number;
}

interface AdminStatsCardsProps {
  totals: AnalyticsTotals;
  conversionRate: string;
}

export default function AdminStatsCards({ totals, conversionRate }: AdminStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Всего просмотров</CardDescription>
          <CardTitle className="text-3xl flex items-center gap-2">
            <Icon name="Eye" className="text-blue-500" size={28} />
            {totals.total_views.toLocaleString()}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Всего заявок</CardDescription>
          <CardTitle className="text-3xl flex items-center gap-2">
            <Icon name="FileEdit" className="text-purple-500" size={28} />
            {totals.total_applications.toLocaleString()}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardDescription>Конверсия</CardDescription>
          <CardTitle className="text-3xl flex items-center gap-2">
            <Icon name="TrendingUp" className="text-green-500" size={28} />
            {conversionRate}%
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Request } from './crm-types';

const PIPELINE_STAGES = [
  { id: 'new', label: 'Новая заявка', color: 'bg-blue-500', icon: 'Inbox' },
  { id: 'contact', label: 'Контакт', color: 'bg-purple-500', icon: 'Phone' },
  { id: 'in_progress', label: 'В работе', color: 'bg-yellow-500', icon: 'Briefcase' },
  { id: 'showing', label: 'Показ', color: 'bg-orange-500', icon: 'Eye' },
  { id: 'negotiation', label: 'Переговоры', color: 'bg-pink-500', icon: 'Handshake' },
  { id: 'completed', label: 'Сделка', color: 'bg-green-500', icon: 'CheckCircle' },
];

const SERVICE_TYPE_ICONS: Record<string, string> = {
  'Купить': 'ShoppingBag',
  'Продать': 'Tag',
  'Аренда': 'Key',
  'Ипотека': 'Percent',
  'Оценка': 'Scale',
  'Консультация': 'MessageCircle',
};

interface CRMAnalyticsTabProps {
  requests: Request[];
  serviceTypes: string[];
}

export default function CRMAnalyticsTab({ requests, serviceTypes }: CRMAnalyticsTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* По типу услуги */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Icon name="PieChart" size={18} className="text-primary" />
            По типу услуги
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {serviceTypes.map(type => {
              const count = requests.filter(r => r.service_type === type).length;
              const pct = Math.round((count / requests.length) * 100);
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <Icon name={(SERVICE_TYPE_ICONS[type] || 'FileText') as Parameters<typeof Icon>[0]['name']} size={14} className="text-primary" />
                      <span className="text-gray-700">{type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{count}</span>
                      <span className="text-gray-400 text-xs">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {serviceTypes.length === 0 && <p className="text-gray-400 text-sm">Нет данных</p>}
          </div>
        </CardContent>
      </Card>

      {/* Воронка продаж */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Icon name="BarChart2" size={18} className="text-primary" />
            Воронка продаж
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {PIPELINE_STAGES.map(stage => {
              const count = requests.filter(r => r.status === stage.id).length;
              const pct = requests.length > 0 ? Math.round((count / requests.length) * 100) : 0;
              return (
                <div key={stage.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <div className="flex items-center gap-2">
                      <Icon name={stage.icon} size={14} className="text-gray-600" />
                      <span className="text-gray-700">{stage.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{count}</span>
                      <span className="text-gray-400 text-xs">{pct}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-full transition-all opacity-80`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* По приоритету */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Icon name="Flame" size={18} className="text-red-500" />
            По приоритету
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { key: 'high', label: 'Высокий', color: 'text-red-600', bg: 'bg-red-50', icon: 'Flame' },
              { key: 'medium', label: 'Средний', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: 'TrendingUp' },
              { key: 'low', label: 'Низкий', color: 'text-gray-600', bg: 'bg-gray-50', icon: 'Minus' },
            ].map(p => (
              <div key={p.key} className={`${p.bg} rounded-xl p-4`}>
                <Icon name={p.icon} size={24} className={`${p.color} mx-auto mb-2`} />
                <div className={`text-3xl font-bold ${p.color}`}>
                  {requests.filter(r => r.priority === p.key).length}
                </div>
                <div className="text-xs text-gray-500 mt-1">{p.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Источники заявок */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Icon name="Share2" size={18} className="text-primary" />
            Источники заявок
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from(new Set(requests.map(r => r.source).filter(Boolean))).map(source => {
              const count = requests.filter(r => r.source === source).length;
              const pct = Math.round((count / requests.length) * 100);
              return (
                <div key={source} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="Globe" size={14} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{source}</span>
                      <span className="font-semibold">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
            {requests.filter(r => r.source).length === 0 && <p className="text-gray-400 text-sm">Нет данных</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

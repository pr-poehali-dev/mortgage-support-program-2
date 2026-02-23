import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Request, getTimeAgo, isNewRequest } from './crm-types';

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

interface CRMPipelineTabProps {
  filteredRequests: Request[];
  onOpenEdit: (req: Request) => void;
  onMoveToStage: (req: Request, stageId: string) => void;
}

export default function CRMPipelineTab({ filteredRequests, onOpenEdit, onMoveToStage }: CRMPipelineTabProps) {
  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {PIPELINE_STAGES.map(stage => {
          const stageRequests = filteredRequests.filter(r => r.status === stage.id);
          return (
            <div key={stage.id} className="w-72 flex-shrink-0">
              <div className={`flex items-center gap-2 p-3 rounded-t-xl ${stage.color} text-white`}>
                <Icon name={stage.icon} size={16} />
                <span className="font-semibold text-sm">{stage.label}</span>
                <Badge className="ml-auto bg-white/30 text-white text-xs">{stageRequests.length}</Badge>
              </div>
              <div className="bg-gray-100 rounded-b-xl p-2 min-h-[300px] space-y-2">
                {stageRequests.length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-8">Пусто</div>
                )}
                {stageRequests.map(req => (
                  <div
                    key={req.id}
                    className={`bg-white rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-all border-l-4 ${
                      req.priority === 'high' ? 'border-red-400' :
                      req.priority === 'medium' ? 'border-yellow-400' : 'border-gray-200'
                    } ${isNewRequest(req.created_at) ? 'ring-2 ring-green-400' : ''}`}
                    onClick={() => onOpenEdit(req)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          {isNewRequest(req.created_at) && (
                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold animate-pulse">НОВАЯ</span>
                          )}
                          <span className="text-[10px] text-gray-500">{getTimeAgo(req.created_at)}</span>
                        </div>
                        <p className="font-semibold text-sm text-gray-900 truncate">{req.name}</p>
                        <p className="text-xs text-gray-500">{req.phone}</p>
                        {req.city && (
                          <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5">
                            <Icon name="MapPin" size={10} />{req.city}
                          </p>
                        )}
                        {req.service_type && (
                          <div className="flex items-center gap-1 mt-1.5">
                            <Icon name={(SERVICE_TYPE_ICONS[req.service_type] || 'FileText') as Parameters<typeof Icon>[0]['name']} size={11} className="text-primary" />
                            <span className="text-xs text-primary font-medium">{req.service_type}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {req.property_cost && (
                      <div className="mt-2 text-xs font-semibold text-green-700 bg-green-50 px-2 py-1 rounded">
                        {new Intl.NumberFormat('ru').format(req.property_cost)} ₽
                      </div>
                    )}
                    <div className="flex gap-1 mt-2">
                      {PIPELINE_STAGES.filter(s => s.id !== stage.id).slice(0, 2).map(s => (
                        <button
                          key={s.id}
                          onClick={e => { e.stopPropagation(); onMoveToStage(req, s.id); }}
                          className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded transition-colors"
                        >
                          → {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

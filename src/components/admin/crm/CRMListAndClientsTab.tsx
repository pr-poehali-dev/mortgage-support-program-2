import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Request, Client, STATUS_COLORS, STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS, getTimeAgo, isNewRequest } from './crm-types';

interface CRMListTabProps {
  filteredRequests: Request[];
  onOpenEdit: (req: Request) => void;
  onDelete: (id: number) => void;
}

export function CRMListTab({ filteredRequests, onOpenEdit, onDelete }: CRMListTabProps) {
  return (
    <div className="space-y-3">
      {filteredRequests.length === 0 && (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-12 text-center text-gray-500">
            <Icon name="Inbox" size={48} className="mx-auto mb-3 opacity-30" />
            <p>Заявок не найдено</p>
          </CardContent>
        </Card>
      )}
      {filteredRequests.map(req => (
        <Card
          key={req.id}
          className={`border-0 shadow-sm hover:shadow-md transition-all cursor-pointer ${
            isNewRequest(req.created_at) ? 'ring-2 ring-green-400 bg-green-50/30' : ''
          }`}
          onClick={() => onOpenEdit(req)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-bold text-sm">
                  {req.name?.charAt(0)?.toUpperCase() || '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-gray-900">{req.name}</span>
                  {isNewRequest(req.created_at) && (
                    <Badge className="bg-green-500 text-xs animate-pulse">Новая</Badge>
                  )}
                  <Badge className={`${STATUS_COLORS[req.status]} text-xs`}>
                    {STATUS_LABELS[req.status]}
                  </Badge>
                  <Badge className={`${PRIORITY_COLORS[req.priority]} text-xs`}>
                    {PRIORITY_LABELS[req.priority]}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-1 flex-wrap">
                  <span className="flex items-center gap-1"><Icon name="Phone" size={13} />{req.phone}</span>
                  {req.email && <span className="flex items-center gap-1"><Icon name="Mail" size={13} />{req.email}</span>}
                  {req.city && <span className="flex items-center gap-1"><Icon name="MapPin" size={13} />{req.city}</span>}
                  {req.service_type && <span className="flex items-center gap-1 text-primary"><Icon name="Briefcase" size={13} />{req.service_type}</span>}
                </div>
                {req.message && (
                  <p className="text-xs text-gray-400 mt-1 truncate">{req.message}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="text-xs text-gray-400">{getTimeAgo(req.created_at)}</span>
                {req.property_cost && (
                  <span className="text-sm font-semibold text-green-700">
                    {new Intl.NumberFormat('ru').format(req.property_cost)} ₽
                  </span>
                )}
                <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                  <Button size="sm" variant="outline" className="h-7 px-2 text-xs"
                    onClick={e => { e.stopPropagation(); onOpenEdit(req); }}>
                    <Icon name="Edit2" size={12} className="mr-1" />
                    Изменить
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={e => { e.stopPropagation(); onDelete(req.id); }}>
                    <Icon name="Trash2" size={12} />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface CRMClientsTabProps {
  clients: Client[];
  requests: Request[];
}

export function CRMClientsTab({ clients, requests }: CRMClientsTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.length === 0 && (
        <div className="col-span-3 text-center py-16 text-gray-400">
          <Icon name="Users" size={48} className="mx-auto mb-3 opacity-30" />
          <p>Клиентов пока нет</p>
        </div>
      )}
      {clients.map(client => {
        const clientRequests = requests.filter(r => r.client_id === client.id);
        const lastReq = clientRequests[0];
        return (
          <Card key={client.id} className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">
                    {client.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{client.name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <Icon name="Phone" size={12} />{client.phone}
                  </p>
                  {client.email && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                      <Icon name="Mail" size={12} />{client.email}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3 pt-3 border-t flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Icon name="FileText" size={10} className="mr-1" />
                    {client.requests_count ?? clientRequests.length} заявок
                  </Badge>
                  {client.source && (
                    <Badge variant="outline" className="text-xs text-gray-500">
                      {client.source}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-gray-400">{getTimeAgo(client.created_at)}</span>
              </div>
              {lastReq && (
                <div className="mt-2 bg-gray-50 rounded-lg p-2 text-xs text-gray-600">
                  <span className="font-medium">Последняя:</span> {lastReq.service_type} · {STATUS_LABELS[lastReq.status]}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

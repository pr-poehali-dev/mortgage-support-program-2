import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Request, STATUS_COLORS, STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS, getTimeAgo, isNewRequest } from './crm-types';

interface CRMRequestsListProps {
  requests: Request[];
  filterStatus: string;
  searchQuery: string;
  onFilterStatusChange: (value: string) => void;
  onSearchQueryChange: (value: string) => void;
  onRequestEdit: (request: Request) => void;
  onRequestDelete: (requestId: number) => void;
}

export default function CRMRequestsList({
  requests,
  filterStatus,
  searchQuery,
  onFilterStatusChange,
  onSearchQueryChange,
  onRequestEdit,
  onRequestDelete
}: CRMRequestsListProps) {
  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesSearch = !searchQuery || 
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.phone.includes(searchQuery) ||
      req.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Заявки</CardTitle>
        <CardDescription>Управление заявками клиентов</CardDescription>
        <div className="flex gap-4 mt-4">
          <Input
            placeholder="Поиск по имени, телефону, городу..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="max-w-md"
          />
          <Select value={filterStatus} onValueChange={onFilterStatusChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все статусы</SelectItem>
              <SelectItem value="new">Новые</SelectItem>
              <SelectItem value="in_progress">В работе</SelectItem>
              <SelectItem value="completed">Завершено</SelectItem>
              <SelectItem value="cancelled">Отменено</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Заявок не найдено</p>
          ) : (
            filteredRequests.map((request) => (
              <Card 
                key={request.id} 
                className={`hover:shadow-md transition-all ${
                  isNewRequest(request.created_at) 
                    ? 'ring-2 ring-green-500 shadow-lg animate-pulse bg-green-50' 
                    : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Icon name="User" size={16} className="text-gray-500" />
                        <span className="font-semibold">{request.name}</span>
                        {isNewRequest(request.created_at) && (
                          <Badge className="bg-green-500 animate-pulse">
                            🔥 НОВАЯ
                          </Badge>
                        )}
                        <Badge className={STATUS_COLORS[request.status]}>
                          {STATUS_LABELS[request.status]}
                        </Badge>
                        <Badge className={PRIORITY_COLORS[request.priority]}>
                          {PRIORITY_LABELS[request.priority]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Icon name="Phone" size={14} />
                          {request.phone}
                        </div>
                        {request.email && (
                          <div className="flex items-center gap-1">
                            <Icon name="Mail" size={14} />
                            {request.email}
                          </div>
                        )}
                        {request.city && (
                          <div className="flex items-center gap-1">
                            <Icon name="MapPin" size={14} />
                            {request.city}
                          </div>
                        )}
                      </div>
                      {request.service_type && (
                        <div className="text-sm">
                          <span className="font-medium">Услуга:</span> {request.service_type}
                        </div>
                      )}
                      {request.message && (
                        <div className="text-sm">
                          <span className="font-medium">Сообщение:</span> {request.message}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Icon name="Clock" size={12} />
                          <span className="font-medium">{getTimeAgo(request.created_at)}</span>
                          <span className="text-gray-400">({new Date(request.created_at).toLocaleString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Tag" size={12} />
                          {request.source}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRequestEdit(request)}
                      >
                        <Icon name="Edit" size={16} className="mr-1" />
                        Изменить
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onRequestDelete(request.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Client, getTimeAgo } from './crm-types';

interface CRMClientsListProps {
  clients: Client[];
}

export default function CRMClientsList({ clients }: CRMClientsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Клиенты</CardTitle>
        <CardDescription>База клиентов ({clients.length})</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {clients.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Клиентов пока нет</p>
          ) : (
            clients.map((client) => (
              <Card key={client.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="User" size={18} className="text-blue-600" />
                        <span className="font-semibold text-lg">{client.name}</span>
                      </div>
                      <Badge>{client.requests_count || 0} заявок</Badge>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Icon name="Phone" size={14} />
                        {client.phone}
                      </div>
                      {client.email && (
                        <div className="flex items-center gap-1">
                          <Icon name="Mail" size={14} />
                          {client.email}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Icon name="Tag" size={14} />
                        {client.source}
                      </div>
                    </div>
                    {client.notes && (
                      <div className="text-sm bg-yellow-50 p-2 rounded">
                        <span className="font-medium">Заметки:</span> {client.notes}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Icon name="Clock" size={12} />
                      <span className="font-medium">{getTimeAgo(client.created_at)}</span>
                      <span className="text-gray-400">({new Date(client.created_at).toLocaleString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })})</span>
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

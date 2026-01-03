import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Request, getTimeAgo, isNewRequest } from './crm-types';

interface CRMRegistrationsListProps {
  requests: Request[];
  onRequestEdit: (request: Request) => void;
  onRequestDelete: (requestId: number) => void;
}

export default function CRMRegistrationsList({
  requests,
  onRequestEdit,
  onRequestDelete
}: CRMRegistrationsListProps) {
  const registrations = requests.filter(r => r.registration_completed);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Полные регистрации</CardTitle>
        <CardDescription>Клиенты, прошедшие полную регистрацию ({registrations.length})</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {registrations.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Регистраций пока нет</p>
          ) : (
            registrations.map((request) => (
              <Card 
                key={request.id} 
                className={`hover:shadow-md transition-all ${
                  isNewRequest(request.created_at) 
                    ? 'ring-2 ring-green-500 shadow-lg animate-pulse bg-green-50' 
                    : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="UserCheck" size={18} className="text-green-600" />
                        <span className="font-semibold text-lg">{request.full_name || request.name}</span>
                        {isNewRequest(request.created_at) && (
                          <Badge className="bg-green-500 animate-pulse">
                            🔥 НОВАЯ
                          </Badge>
                        )}
                      </div>
                      <Badge className="bg-green-500">Полная регистрация</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Телефон:</span>
                        <div className="flex items-center gap-1">
                          <Icon name="Phone" size={14} />
                          {request.phone}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Email:</span>
                        <div className="flex items-center gap-1">
                          <Icon name="Mail" size={14} />
                          {request.email}
                        </div>
                      </div>
                      {request.birth_date && (
                        <div>
                          <span className="font-medium text-gray-600">Дата рождения:</span>
                          <div>{new Date(request.birth_date).toLocaleDateString('ru')}</div>
                        </div>
                      )}
                      {request.employment_type && (
                        <div>
                          <span className="font-medium text-gray-600">Занятость:</span>
                          <div>{request.employment_type}</div>
                        </div>
                      )}
                      {request.monthly_income && (
                        <div>
                          <span className="font-medium text-gray-600">Доход:</span>
                          <div>{Number(request.monthly_income).toLocaleString('ru')} ₽/мес</div>
                        </div>
                      )}
                      {request.property_type && (
                        <div>
                          <span className="font-medium text-gray-600">Тип недвижимости:</span>
                          <div>{request.property_type}</div>
                        </div>
                      )}
                      {request.property_cost && (
                        <div>
                          <span className="font-medium text-gray-600">Стоимость:</span>
                          <div>{Number(request.property_cost).toLocaleString('ru')} ₽</div>
                        </div>
                      )}
                      {request.initial_payment && (
                        <div>
                          <span className="font-medium text-gray-600">Первый взнос:</span>
                          <div>{Number(request.initial_payment).toLocaleString('ru')} ₽</div>
                        </div>
                      )}
                    </div>

                    {request.property_address && (
                      <div className="text-sm">
                        <span className="font-medium text-gray-600">Адрес недвижимости:</span>
                        <div className="flex items-center gap-1 mt-1">
                          <Icon name="MapPin" size={14} />
                          {request.property_address}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" size={12} />
                        <span className="font-medium">{getTimeAgo(request.created_at)}</span>
                        <span className="text-gray-400">({new Date(request.created_at).toLocaleString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })})</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRequestEdit(request)}
                        >
                          <Icon name="Edit" size={14} className="mr-1" />
                          Изменить
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onRequestDelete(request.id)}
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
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

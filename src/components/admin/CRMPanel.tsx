import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';

interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  requests_count?: number;
}

interface Request {
  id: number;
  client_id: number;
  city: string;
  service_type: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  name: string;
  full_name?: string;
  phone: string;
  email: string;
  source: string;
  property_type?: string;
  property_address?: string;
  property_cost?: number;
  initial_payment?: number;
  credit_term?: number;
  birth_date?: string;
  monthly_income?: number;
  employment_type?: string;
  registration_completed?: boolean;
}

interface QuizResult {
  category: string;
  region: string;
  loan_amount_range: string;
  recommended_program: string;
  count: number;
  last_taken: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500'
};

const STATUS_LABELS: Record<string, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  completed: 'Завершена',
  cancelled: 'Отменена'
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-red-500'
};

const PRIORITY_LABELS: Record<string, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий'
};

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays < 7) return `${diffDays} дн. назад`;
  return past.toLocaleDateString('ru', { day: 'numeric', month: 'short', year: 'numeric' });
}

function isNewRequest(dateString: string): boolean {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  return diffMins < 5; // Заявки младше 5 минут считаются новыми
}

export default function CRMPanel() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [editingStatus, setEditingStatus] = useState('');
  const [editingPriority, setEditingPriority] = useState('');
  const [editingNotes, setEditingNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lastRequestCount, setLastRequestCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          fetchRequests(),
          fetchClients(),
          fetchQuizResults()
        ]);
      } catch (err) {
        setError('Ошибка загрузки данных CRM');
        console.error('CRM Panel error:', err);
      }
    };
    loadData();

    // Автообновление каждые 30 секунд
    const interval = setInterval(async () => {
      setIsRefreshing(true);
      await Promise.all([
        fetchRequests(),
        fetchClients(),
        fetchQuizResults()
      ]);
      setTimeout(() => setIsRefreshing(false), 500);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Отслеживание новых заявок и воспроизведение звука
  useEffect(() => {
    if (lastRequestCount > 0 && requests.length > lastRequestCount) {
      const newRequestsCount = requests.length - lastRequestCount;
      if (soundEnabled) {
        playNotificationSound();
      }
      toast({
        title: '🔔 Новая заявка!',
        description: `Получено новых заявок: ${newRequestsCount}`,
        duration: 5000
      });
    }
    setLastRequestCount(requests.length);
  }, [requests.length, soundEnabled, lastRequestCount]);

  const playNotificationSound = () => {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGGm58OScTgwOUKnn77RgGwU7k9XvyHkpBSh+zO/ekkALEmCy6OSjVhINSKHh8r5rIQUsgs/y2Ik3CBdquvDjnE4MDlGp5++zYRsEOpLU8Md5KAUnfczt3pJACxNhsunko1YRDUqg4fK+aSEFKoHN8tmJNggWa7rw45xODA5RqefvsmEbBDmR1PDGeScFKHzM7t+SUQsUYrLp46NVEAxKoOHyvmkhBSuCzvLZiTYIFmy68OKbTgwMUKnn77JhGwU7k9TvxngnBSd7zO7fklALFWGy6eOiVREMSaDh8r5pIQUrgc7y2Yk2CBVruvDjnE4NDVCq5++yYRsFOpLT8MZ4JgUndMzt3pJQChZhsefjo1YRDEqg4fK+aiEEK4DN8tmJNQgVa7rx4ptODA5QqufvsmEbBTmR0+/HeCYEKHvM7t+SUAUVY7Hp46NWEAxKoOLyvmkhBSuCzvLYijUIFWq68OKdTgwOUKnm77JhGgU5kdPvxnkmBSh8yu/fklELFGKy6eKjVhAMSqDi8r1pIAQsgM3y2Ik1CBRquvDjm04MDlCp5++yYRoFOpLU78V4JwUofMrv35JRCxRisunioldREAtJoOLyvWogBSyAzvLYiTUIFWu68OOdTgwNUKrm77JhGgU6ktXvxXcmBCh7yu/fklALFWKx6eKjVhAMSqDi8r1qIAUshM3y14k1CBZquvDjm04MDVCq5u+yYRoEO5LT78V4JgQoe8rv35JRC');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Игнорируем ошибки автовоспроизведения
      });
    } catch (error) {
      console.log('Notification sound disabled');
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/e72807e0-91d8-4a57-992b-41b5cc49df17?action=requests');
      const data = await response.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setRequests([]);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить заявки',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/e72807e0-91d8-4a57-992b-41b5cc49df17?action=clients');
      const data = await response.json();
      setClients(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClients([]);
    }
  };

  const fetchQuizResults = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/e72807e0-91d8-4a57-992b-41b5cc49df17?action=quiz_stats');
      const data = await response.json();
      setQuizResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      setQuizResults([]);
    }
  };

  const handleDeleteRequest = async (requestId: number) => {
    if (!confirm('Вы уверены, что хотите удалить эту заявку?')) return;

    try {
      const response = await fetch(`https://functions.poehali.dev/e72807e0-91d8-4a57-992b-41b5cc49df17?request_id=${requestId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Успешно',
          description: 'Заявка удалена'
        });
        fetchRequests();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить заявку',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;

    try {
      const response = await fetch('https://functions.poehali.dev/e72807e0-91d8-4a57-992b-41b5cc49df17', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          request_id: selectedRequest.id,
          status: editingStatus || selectedRequest.status,
          priority: editingPriority || selectedRequest.priority,
          notes: editingNotes
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Успешно',
          description: 'Заявка обновлена'
        });
        fetchRequests();
        fetchClients();
        setSelectedRequest(null);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить заявку',
        variant: 'destructive'
      });
    }
  };

  const openRequestDetails = (request: Request) => {
    setSelectedRequest(request);
    setEditingStatus(request.status);
    setEditingPriority(request.priority);
    setEditingNotes('');
  };

  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus;
    const matchesSearch = !searchQuery || 
      req.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.phone.includes(searchQuery) ||
      req.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    in_progress: requests.filter(r => r.status === 'in_progress').length,
    completed: requests.filter(r => r.status === 'completed').length,
    fresh: requests.filter(r => isNewRequest(r.created_at)).length
  };

  if (error) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-600">
            <Icon name="AlertCircle" size={24} />
            <div>
              <p className="font-semibold">Ошибка загрузки CRM</p>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon name="Loader2" className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">CRM Система</h2>
        <div className="flex items-center gap-3">
          {isRefreshing && (
            <div className="flex items-center gap-2 text-blue-600 text-sm">
              <Icon name="RefreshCw" size={16} className="animate-spin" />
              Обновление...
            </div>
          )}
          <Button
            variant={soundEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="gap-2"
          >
            <Icon name={soundEnabled ? "Volume2" : "VolumeX"} size={16} />
            {soundEnabled ? "Звук вкл" : "Звук выкл"}
          </Button>
          <div className="text-sm text-gray-500">
            Автообновление: 30 сек
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Всего заявок</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Новые</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-3xl font-bold text-blue-600">{stats.new}</div>
              {stats.fresh > 0 && (
                <Badge className="bg-green-500 animate-pulse">
                  +{stats.fresh} свежих
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">В работе</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.in_progress}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Завершено</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="w-full">
        <TabsList>
          <TabsTrigger value="requests">
            <Icon name="FileText" size={16} className="mr-2" />
            Заявки
          </TabsTrigger>
          <TabsTrigger value="clients">
            <Icon name="Users" size={16} className="mr-2" />
            Клиенты
          </TabsTrigger>
          <TabsTrigger value="registrations">
            <Icon name="UserCheck" size={16} className="mr-2" />
            Регистрации
          </TabsTrigger>
          <TabsTrigger value="quiz">
            <Icon name="BarChart3" size={16} className="mr-2" />
            Результаты опросов
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Заявки</CardTitle>
              <CardDescription>Управление заявками клиентов</CardDescription>
              <div className="flex gap-4 mt-4">
                <Input
                  placeholder="Поиск по имени, телефону, городу..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
                <Select value={filterStatus} onValueChange={setFilterStatus}>
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
                              onClick={() => openRequestDetails(request)}
                            >
                              <Icon name="Edit" size={16} className="mr-1" />
                              Изменить
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteRequest(request.id)}
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
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
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
        </TabsContent>

        <TabsContent value="registrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Полные регистрации</CardTitle>
              <CardDescription>Клиенты, прошедшие полную регистрацию ({requests.filter(r => r.registration_completed).length})</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.filter(r => r.registration_completed).length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Регистраций пока нет</p>
                ) : (
                  requests.filter(r => r.registration_completed).map((request) => (
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
                                onClick={() => openRequestDetails(request)}
                              >
                                <Icon name="Edit" size={14} className="mr-1" />
                                Изменить
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteRequest(request.id)}
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
        </TabsContent>

        <TabsContent value="quiz" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Статистика опросов</CardTitle>
              <CardDescription>Результаты прохождения опроса по подбору ипотеки</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quizResults.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Данных по опросам пока нет</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quizResults.map((result, idx) => (
                      <Card key={idx} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-lg">{result.recommended_program}</span>
                              <Badge className="bg-blue-500">{result.count} прохождений</Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                              <div>
                                <span className="font-medium">Категория:</span>
                                <div>{result.category}</div>
                              </div>
                              <div>
                                <span className="font-medium">Регион:</span>
                                <div>{result.region}</div>
                              </div>
                              <div className="col-span-2">
                                <span className="font-medium">Сумма кредита:</span>
                                <div>{result.loan_amount_range}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                              <Icon name="Clock" size={12} />
                              <span>Последнее:</span>
                              <span className="font-medium">{getTimeAgo(result.last_taken)}</span>
                              <span className="text-gray-400">({new Date(result.last_taken).toLocaleString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })})</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedRequest && (
        <Card className="fixed bottom-4 right-4 w-96 shadow-2xl z-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Редактирование заявки</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedRequest(null)}
              >
                <Icon name="X" size={18} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Статус</label>
              <Select value={editingStatus} onValueChange={setEditingStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Новая</SelectItem>
                  <SelectItem value="in_progress">В работе</SelectItem>
                  <SelectItem value="completed">Завершена</SelectItem>
                  <SelectItem value="cancelled">Отменена</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Приоритет</label>
              <Select value={editingPriority} onValueChange={setEditingPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Низкий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="high">Высокий</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Заметки</label>
              <Textarea
                value={editingNotes}
                onChange={(e) => setEditingNotes(e.target.value)}
                placeholder="Добавьте заметки о клиенте..."
                rows={3}
              />
            </div>
            <Button onClick={handleUpdateRequest} className="w-full">
              <Icon name="Save" size={16} className="mr-2" />
              Сохранить изменения
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
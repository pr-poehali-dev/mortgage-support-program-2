import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import { Request, Client, QuizResult, STATUS_COLORS, STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS, isNewRequest } from './crm/crm-types';
import CRMRequestsList from './crm/CRMRequestsList';
import CRMClientsList from './crm/CRMClientsList';
import CRMRegistrationsList from './crm/CRMRegistrationsList';
import CRMQuizStats from './crm/CRMQuizStats';

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
          <CRMRequestsList
            requests={requests}
            filterStatus={filterStatus}
            searchQuery={searchQuery}
            onFilterStatusChange={setFilterStatus}
            onSearchQueryChange={setSearchQuery}
            onRequestEdit={openRequestDetails}
            onRequestDelete={handleDeleteRequest}
          />
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <CRMClientsList clients={clients} />
        </TabsContent>

        <TabsContent value="registrations" className="space-y-4">
          <CRMRegistrationsList
            requests={requests}
            onRequestEdit={openRequestDetails}
            onRequestDelete={handleDeleteRequest}
          />
        </TabsContent>

        <TabsContent value="quiz" className="space-y-4">
          <CRMQuizStats quizResults={quizResults} />
        </TabsContent>
      </Tabs>

      {selectedRequest && (
        <Card className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Редактирование заявки</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Клиент</label>
                <p className="text-lg font-semibold">{selectedRequest.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Телефон</label>
                <p>{selectedRequest.phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <p>{selectedRequest.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Статус</label>
                <Select value={editingStatus} onValueChange={setEditingStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${STATUS_COLORS[key]}`} />
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Приоритет</label>
                <Select value={editingPriority} onValueChange={setEditingPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${PRIORITY_COLORS[key]}`} />
                          {label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Заметки</label>
                <Textarea
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Добавить заметку..."
                  rows={4}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                  Отмена
                </Button>
                <Button onClick={handleUpdateRequest}>
                  Сохранить
                </Button>
              </div>
            </CardContent>
          </Card>
        </Card>
      )}
    </div>
  );
}

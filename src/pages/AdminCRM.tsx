import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import AdminLogin from '@/components/admin/AdminLogin';
import { Request, Client, STATUS_COLORS, STATUS_LABELS, PRIORITY_COLORS, PRIORITY_LABELS, getTimeAgo, isNewRequest } from '@/components/admin/crm/crm-types';

const ADMIN_PASSWORD = 'admin2024';

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

const API_URL = 'https://functions.poehali.dev/e72807e0-91d8-4a57-992b-41b5cc49df17';

export default function AdminCRM() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [requests, setRequests] = useState<Request[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState('pipeline');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'name'>('date');

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState('');
  const [editingPriority, setEditingPriority] = useState('');
  const [editingNotes, setEditingNotes] = useState('');
  const [editingStage, setEditingStage] = useState('');

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Неверный пароль');
    }
  };

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}?action=requests`);
      const data = await res.json();
      setRequests(Array.isArray(data) ? data : []);
    } catch {
      setRequests([]);
    }
  }, []);

  const fetchClients = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}?action=clients`);
      const data = await res.json();
      setClients(Array.isArray(data) ? data : []);
    } catch {
      setClients([]);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      setDataLoading(true);
      await Promise.all([fetchRequests(), fetchClients()]);
      setDataLoading(false);
    };
    load();

    const interval = setInterval(async () => {
      setIsRefreshing(true);
      await Promise.all([fetchRequests(), fetchClients()]);
      setIsRefreshing(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchRequests, fetchClients]);

  const handleUpdateRequest = async () => {
    if (!selectedRequest) return;
    try {
      const res = await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: selectedRequest.id,
          status: editingStage || editingStatus || selectedRequest.status,
          priority: editingPriority || selectedRequest.priority,
          notes: editingNotes,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast({ title: 'Сохранено', description: 'Заявка обновлена' });
        fetchRequests();
        setEditDialogOpen(false);
        setSelectedRequest(null);
      }
    } catch {
      toast({ title: 'Ошибка', description: 'Не удалось сохранить', variant: 'destructive' });
    }
  };

  const handleDeleteRequest = async (id: number) => {
    if (!confirm('Удалить заявку?')) return;
    try {
      await fetch(`${API_URL}?request_id=${id}`, { method: 'DELETE' });
      toast({ title: 'Удалено' });
      fetchRequests();
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const openEdit = (req: Request) => {
    setSelectedRequest(req);
    setEditingStatus(req.status);
    setEditingPriority(req.priority);
    setEditingStage(req.status);
    setEditingNotes('');
    setEditDialogOpen(true);
  };

  const moveToStage = async (req: Request, stageId: string) => {
    try {
      await fetch(API_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: req.id, status: stageId, priority: req.priority, notes: '' }),
      });
      fetchRequests();
      toast({ title: `Перемещено: ${PIPELINE_STAGES.find(s => s.id === stageId)?.label}` });
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const filteredRequests = requests
    .filter(r => {
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      if (filterService !== 'all' && r.service_type !== filterService) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          r.name?.toLowerCase().includes(q) ||
          r.phone?.includes(q) ||
          r.city?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.service_type?.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'priority') {
        const order = { high: 0, medium: 1, low: 2 };
        return (order[a.priority as keyof typeof order] ?? 1) - (order[b.priority as keyof typeof order] ?? 1);
      }
      return a.name.localeCompare(b.name, 'ru');
    });

  const stats = {
    total: requests.length,
    new: requests.filter(r => r.status === 'new').length,
    inWork: requests.filter(r => r.status === 'in_progress').length,
    deals: requests.filter(r => r.status === 'completed').length,
    highPriority: requests.filter(r => r.priority === 'high').length,
    fresh: requests.filter(r => isNewRequest(r.created_at)).length,
    conversion: requests.length > 0
      ? Math.round((requests.filter(r => r.status === 'completed').length / requests.length) * 100)
      : 0,
  };

  const serviceTypes = Array.from(new Set(requests.map(r => r.service_type).filter(Boolean)));

  if (!isAuthenticated) {
    return (
      <AdminLogin
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        loading={loading}
        error={error}
      />
    );
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Icon name="Loader2" className="animate-spin text-primary mx-auto" size={48} />
          <p className="text-gray-600">Загрузка CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
                <Icon name="ChevronLeft" size={18} className="mr-1" />
                Назад
              </Button>
              <div className="h-6 w-px bg-gray-200" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Icon name="Users" size={22} className="text-primary" />
                  CRM — Управление клиентами
                </h1>
                <p className="text-xs text-gray-500">Недвижимость · Все заявки и сделки</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isRefreshing && (
                <Icon name="Loader2" size={16} className="animate-spin text-blue-500" />
              )}
              <Badge variant="outline" className="text-green-600 border-green-300">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse inline-block" />
                Live
              </Badge>
              <Button size="sm" onClick={() => { fetchRequests(); fetchClients(); }}>
                <Icon name="RefreshCw" size={14} className="mr-1" />
                Обновить
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          {[
            { label: 'Всего заявок', value: stats.total, icon: 'Inbox', color: 'text-gray-700', bg: 'bg-gray-100' },
            { label: 'Новых', value: stats.new, icon: 'Sparkles', color: 'text-blue-700', bg: 'bg-blue-50' },
            { label: 'В работе', value: stats.inWork, icon: 'Briefcase', color: 'text-yellow-700', bg: 'bg-yellow-50' },
            { label: 'Сделок', value: stats.deals, icon: 'CheckCircle2', color: 'text-green-700', bg: 'bg-green-50' },
            { label: 'Горячих', value: stats.highPriority, icon: 'Flame', color: 'text-red-700', bg: 'bg-red-50' },
            { label: 'Только что', value: stats.fresh, icon: 'Zap', color: 'text-purple-700', bg: 'bg-purple-50' },
            { label: 'Конверсия', value: `${stats.conversion}%`, icon: 'TrendingUp', color: 'text-indigo-700', bg: 'bg-indigo-50' },
          ].map((kpi, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-3 flex flex-col items-center text-center gap-1">
                <div className={`w-9 h-9 rounded-lg ${kpi.bg} flex items-center justify-center`}>
                  <Icon name={kpi.icon} size={18} className={kpi.color} />
                </div>
                <span className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</span>
                <span className="text-xs text-gray-500 leading-tight">{kpi.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px]">
                <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Поиск по имени, телефону, городу..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все статусы</SelectItem>
                  <SelectItem value="new">Новые</SelectItem>
                  <SelectItem value="in_progress">В работе</SelectItem>
                  <SelectItem value="completed">Сделки</SelectItem>
                  <SelectItem value="cancelled">Отменены</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterService} onValueChange={setFilterService}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Услуга" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все услуги</SelectItem>
                  {serviceTypes.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={v => setSortBy(v as typeof sortBy)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">По дате</SelectItem>
                  <SelectItem value="priority">По приоритету</SelectItem>
                  <SelectItem value="name">По имени</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-500 ml-auto">
                Показано: <b>{filteredRequests.length}</b> из {requests.length}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white shadow-sm border">
            <TabsTrigger value="pipeline" className="flex items-center gap-1.5">
              <Icon name="Columns" size={15} />
              Воронка
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-1.5">
              <Icon name="List" size={15} />
              Список
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-1.5">
              <Icon name="Users" size={15} />
              Клиенты
              <Badge className="bg-primary/10 text-primary text-xs ml-1 px-1.5">{clients.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-1.5">
              <Icon name="BarChart2" size={15} />
              Аналитика
            </TabsTrigger>
          </TabsList>

          {/* === ВОРОНКА === */}
          <TabsContent value="pipeline" className="mt-4">
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
                            onClick={() => openEdit(req)}
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
                                {req.city && <p className="text-xs text-gray-400 flex items-center gap-0.5 mt-0.5"><Icon name="MapPin" size={10} />{req.city}</p>}
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
                                  onClick={e => { e.stopPropagation(); moveToStage(req, s.id); }}
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
          </TabsContent>

          {/* === СПИСОК === */}
          <TabsContent value="list" className="mt-4">
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
                  onClick={() => openEdit(req)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary font-bold text-sm">
                          {req.name?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      </div>

                      {/* Info */}
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

                      {/* Right */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-400">{getTimeAgo(req.created_at)}</span>
                        {req.property_cost && (
                          <span className="text-sm font-semibold text-green-700">
                            {new Intl.NumberFormat('ru').format(req.property_cost)} ₽
                          </span>
                        )}
                        <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={e => { e.stopPropagation(); openEdit(req); }}>
                            <Icon name="Edit2" size={12} className="mr-1" />
                            Изменить
                          </Button>
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={e => { e.stopPropagation(); handleDeleteRequest(req.id); }}>
                            <Icon name="Trash2" size={12} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* === КЛИЕНТЫ === */}
          <TabsContent value="clients" className="mt-4">
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
          </TabsContent>

          {/* === АНАЛИТИКА === */}
          <TabsContent value="analytics" className="mt-4">
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

              {/* По статусу */}
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

              {/* Источники */}
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
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon name="User" size={18} />
              {selectedRequest?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              {/* Contact info */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">Телефон</p>
                  <a href={`tel:${selectedRequest.phone}`} className="font-semibold text-primary">
                    {selectedRequest.phone}
                  </a>
                </div>
                {selectedRequest.email && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Email</p>
                    <a href={`mailto:${selectedRequest.email}`} className="font-semibold text-primary truncate block">
                      {selectedRequest.email}
                    </a>
                  </div>
                )}
                {selectedRequest.city && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Город</p>
                    <p className="font-semibold">{selectedRequest.city}</p>
                  </div>
                )}
                {selectedRequest.service_type && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-gray-500 text-xs mb-1">Услуга</p>
                    <p className="font-semibold text-primary">{selectedRequest.service_type}</p>
                  </div>
                )}
                {selectedRequest.property_cost && (
                  <div className="bg-green-50 rounded-lg p-3 col-span-2">
                    <p className="text-gray-500 text-xs mb-1">Стоимость объекта</p>
                    <p className="font-bold text-green-700 text-lg">
                      {new Intl.NumberFormat('ru').format(selectedRequest.property_cost)} ₽
                    </p>
                  </div>
                )}
              </div>

              {selectedRequest.message && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Сообщение клиента</p>
                  <p className="text-sm text-gray-800">{selectedRequest.message}</p>
                </div>
              )}

              {/* Stage */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Этап воронки</label>
                <div className="grid grid-cols-3 gap-2">
                  {PIPELINE_STAGES.map(stage => (
                    <button
                      key={stage.id}
                      onClick={() => setEditingStage(stage.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 text-xs transition-all ${
                        editingStage === stage.id
                          ? `${stage.color} text-white border-transparent`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon name={stage.icon} size={14} />
                      {stage.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Приоритет</label>
                <div className="flex gap-2">
                  {[
                    { key: 'high', label: 'Высокий', color: 'bg-red-500' },
                    { key: 'medium', label: 'Средний', color: 'bg-yellow-500' },
                    { key: 'low', label: 'Низкий', color: 'bg-gray-400' },
                  ].map(p => (
                    <button
                      key={p.key}
                      onClick={() => setEditingPriority(p.key)}
                      className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm transition-all ${
                        editingPriority === p.key
                          ? `${p.color} text-white border-transparent`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Комментарий</label>
                <Textarea
                  placeholder="Добавить заметку по клиенту..."
                  value={editingNotes}
                  onChange={e => setEditingNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button className="flex-1" onClick={handleUpdateRequest}>
                  <Icon name="Check" size={16} className="mr-1.5" />
                  Сохранить
                </Button>
                <a href={`tel:${selectedRequest.phone}`}>
                  <Button variant="outline" className="flex items-center gap-1.5">
                    <Icon name="Phone" size={16} />
                    Позвонить
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => { handleDeleteRequest(selectedRequest.id); setEditDialogOpen(false); }}
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

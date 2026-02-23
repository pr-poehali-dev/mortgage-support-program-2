import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import AdminLogin from '@/components/admin/AdminLogin';
import { Request, Client, isNewRequest } from '@/components/admin/crm/crm-types';
import CRMPageHeader from '@/components/admin/crm/CRMPageHeader';
import CRMPipelineTab from '@/components/admin/crm/CRMPipelineTab';
import { CRMListTab, CRMClientsTab } from '@/components/admin/crm/CRMListAndClientsTab';
import CRMAnalyticsTab from '@/components/admin/crm/CRMAnalyticsTab';
import CRMEditDialog from '@/components/admin/crm/CRMEditDialog';

const ADMIN_PASSWORD = 'admin2024';
const API_URL = 'https://functions.poehali.dev/e72807e0-91d8-4a57-992b-41b5cc49df17';

const PIPELINE_STAGES_LABELS: Record<string, string> = {
  new: 'Новая заявка',
  contact: 'Контакт',
  in_progress: 'В работе',
  showing: 'Показ',
  negotiation: 'Переговоры',
  completed: 'Сделка',
};

export default function AdminCRM() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading] = useState(false);
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
      toast({ title: `Перемещено: ${PIPELINE_STAGES_LABELS[stageId] ?? stageId}` });
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
      <CRMPageHeader
        isRefreshing={isRefreshing}
        onRefresh={() => { fetchRequests(); fetchClients(); }}
      />

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

          <TabsContent value="pipeline" className="mt-4">
            <CRMPipelineTab
              filteredRequests={filteredRequests}
              onOpenEdit={openEdit}
              onMoveToStage={moveToStage}
            />
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <CRMListTab
              filteredRequests={filteredRequests}
              onOpenEdit={openEdit}
              onDelete={handleDeleteRequest}
            />
          </TabsContent>

          <TabsContent value="clients" className="mt-4">
            <CRMClientsTab
              clients={clients}
              requests={requests}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-4">
            <CRMAnalyticsTab
              requests={requests}
              serviceTypes={serviceTypes}
            />
          </TabsContent>
        </Tabs>
      </div>

      <CRMEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        selectedRequest={selectedRequest}
        editingStage={editingStage}
        setEditingStage={setEditingStage}
        editingPriority={editingPriority}
        setEditingPriority={setEditingPriority}
        editingNotes={editingNotes}
        setEditingNotes={setEditingNotes}
        onSave={handleUpdateRequest}
        onDelete={handleDeleteRequest}
      />
    </div>
  );
}

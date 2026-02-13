import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import funcUrls from '../../backend/func2url.json';

interface NewsItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  photo_url: string | null;
  photos: string[];
  source: string;
  source_url: string;
  category: string;
  is_published: boolean;
  is_pinned: boolean;
  views_count: number;
  created_at: string;
}

const CATEGORIES = [
  { value: 'mortgage', label: 'Ипотека' },
  { value: 'law', label: 'Законодательство' },
  { value: 'market', label: 'Рынок' },
  { value: 'tips', label: 'Советы' },
  { value: 'general', label: 'Общие' },
];

const emptyForm = {
  title: '',
  summary: '',
  content: '',
  photo_url: '',
  photos: [] as string[],
  source: '',
  source_url: '',
  category: 'general',
  is_published: true,
  is_pinned: false,
};

export default function AdminNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<NewsItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('adminAuthenticated');
    if (saved === 'true') setIsAuthenticated(true);
  }, []);

  const handleLogin = () => {
    if (password === 'admin2024') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
    } else {
      toast({ title: 'Неверный пароль', variant: 'destructive' });
    }
  };

  const loadNews = () => {
    setLoading(true);
    fetch(`${funcUrls.news}?show_all=true&limit=200`)
      .then(r => r.json())
      .then(data => {
        if (data.success) setNews(data.news);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated) loadNews();
  }, [isAuthenticated]);

  const openCreate = () => {
    setEditItem(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item: NewsItem) => {
    setEditItem(item);
    setForm({
      title: item.title,
      summary: item.summary || '',
      content: item.content || '',
      photo_url: item.photo_url || '',
      photos: item.photos || [],
      source: item.source || '',
      source_url: item.source_url || '',
      category: item.category || 'general',
      is_published: item.is_published,
      is_pinned: item.is_pinned,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: 'Введите заголовок', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const method = editItem ? 'PUT' : 'POST';
      const body = editItem ? { ...form, id: editItem.id } : form;
      const res = await fetch(funcUrls.news, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: editItem ? 'Новость обновлена' : 'Новость создана' });
        setDialogOpen(false);
        loadNews();
      } else {
        toast({ title: data.error || 'Ошибка', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Ошибка сети', variant: 'destructive' });
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить новость?')) return;
    try {
      const res = await fetch(`${funcUrls.news}?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Удалено' });
        loadNews();
      }
    } catch {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  const togglePublished = async (item: NewsItem) => {
    await fetch(funcUrls.news, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, is_published: !item.is_published }),
    });
    loadNews();
  };

  const runParser = async () => {
    setParsing(true);
    try {
      const res = await fetch(funcUrls['news-parser'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: `Спарсено ${data.parsed}, добавлено ${data.inserted}, пропущено ${data.skipped}` });
        loadNews();
      } else {
        toast({ title: 'Ошибка парсинга', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Ошибка сети', variant: 'destructive' });
    }
    setParsing(false);
  };

  const togglePinned = async (item: NewsItem) => {
    await fetch(funcUrls.news, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, is_pinned: !item.is_pinned }),
    });
    loadNews();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full">
          <h2 className="text-xl font-bold mb-4 text-center">Вход в управление новостями</h2>
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            className="mb-4"
          />
          <Button onClick={handleLogin} className="w-full">Войти</Button>
        </div>
      </div>
    );
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')}>
              <Icon name="ArrowLeft" size={20} />
            </Button>
            <Icon name="Newspaper" size={22} className="text-primary" />
            <h1 className="text-lg font-bold">Управление новостями</h1>
            <span className="text-sm text-gray-400">({news.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={runParser} size="sm" variant="outline" disabled={parsing}>
              {parsing ? <Icon name="Loader2" size={16} className="mr-1.5 animate-spin" /> : <Icon name="Rss" size={16} className="mr-1.5" />}
              {parsing ? 'Парсинг...' : 'Загрузить из RSS'}
            </Button>
            <Button onClick={openCreate} size="sm">
              <Icon name="Plus" size={16} className="mr-1.5" />
              Добавить
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center py-16">
            <Icon name="Loader2" className="animate-spin text-primary" size={40} />
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="Newspaper" size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">Новостей пока нет</p>
            <Button onClick={openCreate}>Создать первую новость</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {news.map(item => (
              <div key={item.id} className={`bg-white rounded-xl p-4 shadow-sm border flex flex-col sm:flex-row gap-4 ${!item.is_published ? 'opacity-60' : ''}`}>
                {item.photo_url && (
                  <img src={item.photo_url} alt="" className="w-full sm:w-24 h-24 rounded-lg object-cover flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2 mb-1">
                    {item.is_pinned && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-semibold rounded-full flex-shrink-0">
                        <Icon name="Pin" size={10} />
                        Закреплено
                      </span>
                    )}
                    {!item.is_published && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-semibold rounded-full flex-shrink-0">
                        Черновик
                      </span>
                    )}
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full flex-shrink-0">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span>{formatDate(item.created_at)}</span>
                    <span>{item.views_count} просмотров</span>
                    <span className="text-primary cursor-pointer hover:underline" onClick={() => navigate(`/news/${item.slug}`)}>
                      Открыть
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => togglePinned(item)} title={item.is_pinned ? 'Открепить' : 'Закрепить'}>
                    <Icon name="Pin" size={16} className={item.is_pinned ? 'text-red-500' : 'text-gray-400'} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => togglePublished(item)} title={item.is_published ? 'Скрыть' : 'Опубликовать'}>
                    <Icon name={item.is_published ? 'Eye' : 'EyeOff'} size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                    <Icon name="Pencil" size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                    <Icon name="Trash2" size={16} className="text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editItem ? 'Редактировать новость' : 'Новая новость'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Заголовок *</label>
              <Input
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Заголовок новости"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Краткое описание</label>
              <Textarea
                value={form.summary}
                onChange={e => setForm({ ...form, summary: e.target.value })}
                placeholder="Краткое описание для карточки"
                rows={2}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Полный текст *</label>
              <Textarea
                value={form.content}
                onChange={e => setForm({ ...form, content: e.target.value })}
                placeholder="Полный текст новости"
                rows={10}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">URL фото (обложка)</label>
              <Input
                value={form.photo_url}
                onChange={e => setForm({ ...form, photo_url: e.target.value })}
                placeholder="https://..."
              />
              {form.photo_url && (
                <img src={form.photo_url} alt="" className="mt-2 rounded-lg max-h-40 object-cover" />
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Категория</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Источник</label>
                <Input
                  value={form.source}
                  onChange={e => setForm({ ...form, source: e.target.value })}
                  placeholder="Название источника"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Ссылка на источник</label>
              <Input
                value={form.source_url}
                onChange={e => setForm({ ...form, source_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={e => setForm({ ...form, is_published: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Опубликовать</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_pinned}
                  onChange={e => setForm({ ...form, is_pinned: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Закрепить</span>
              </label>
            </div>
            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? <Icon name="Loader2" size={16} className="animate-spin mr-1.5" /> : null}
                {editItem ? 'Сохранить' : 'Создать'}
              </Button>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Отмена</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
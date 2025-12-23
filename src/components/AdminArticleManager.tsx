import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { blogArticles } from '@/data/mortgageData';
import { sendNewsletter } from '@/utils/sendNewsletter';

interface Article {
  id: number;
  title: string;
  publishDate?: string;
  published?: boolean;
  category: string;
  excerpt: string;
  content?: string;
  date?: string;
  readTime?: string;
  icon?: string;
  color?: string;
  image?: string;
}

const ADMIN_PASSWORD = 'ipoteka2025';

export default function AdminArticleManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState('');
  const [editingContentId, setEditingContentId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    readTime: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadArticles();
    }
  }, []);

  const loadArticles = () => {
    const storedOverrides = localStorage.getItem('article_publish_overrides');
    const overrides = storedOverrides ? JSON.parse(storedOverrides) : {};
    const storedContent = localStorage.getItem('article_content_overrides');
    const contentOverrides = storedContent ? JSON.parse(storedContent) : {};

    const articlesWithOverrides = blogArticles.map(article => ({
      ...article,
      publishDate: overrides[article.id]?.publishDate || article.publishDate,
      published: overrides[article.id]?.published !== undefined 
        ? overrides[article.id].published 
        : article.published,
      title: contentOverrides[article.id]?.title || article.title,
      excerpt: contentOverrides[article.id]?.excerpt || article.excerpt,
      content: contentOverrides[article.id]?.content || article.content,
      category: contentOverrides[article.id]?.category || article.category,
      readTime: contentOverrides[article.id]?.readTime || article.readTime
    }));

    setArticles(articlesWithOverrides);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      loadArticles();
      toast({
        title: '✅ Доступ разрешён',
        description: 'Добро пожаловать в панель управления'
      });
    } else {
      toast({
        title: '❌ Неверный пароль',
        description: 'Попробуйте снова',
        variant: 'destructive'
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    setPassword('');
  };

  const handleSaveDate = (articleId: number) => {
    if (!newDate) {
      toast({
        title: 'Ошибка',
        description: 'Выберите дату публикации',
        variant: 'destructive'
      });
      return;
    }

    const storedOverrides = localStorage.getItem('article_publish_overrides');
    const overrides = storedOverrides ? JSON.parse(storedOverrides) : {};

    overrides[articleId] = {
      ...overrides[articleId],
      publishDate: newDate
    };

    localStorage.setItem('article_publish_overrides', JSON.stringify(overrides));
    
    setEditingId(null);
    setNewDate('');
    loadArticles();

    toast({
      title: '✅ Дата обновлена',
      description: 'Статья будет опубликована в указанную дату'
    });
  };

  const handleTogglePublished = (articleId: number, currentStatus: boolean) => {
    const storedOverrides = localStorage.getItem('article_publish_overrides');
    const overrides = storedOverrides ? JSON.parse(storedOverrides) : {};

    overrides[articleId] = {
      ...overrides[articleId],
      published: !currentStatus
    };

    localStorage.setItem('article_publish_overrides', JSON.stringify(overrides));
    loadArticles();

    toast({
      title: !currentStatus ? '✅ Статья опубликована' : '⏸️ Публикация отменена',
      description: !currentStatus ? 'Статья теперь видна всем' : 'Статья скрыта'
    });
  };

  const handleSendNewsletter = async (article: Article) => {
    const result = await sendNewsletter({
      articleId: article.id,
      articleTitle: article.title,
      articleExcerpt: article.excerpt
    });

    if (result.success) {
      toast({
        title: '✅ Рассылка отправлена',
        description: `Email отправлен ${result.sent_count} подписчикам`
      });
    } else {
      toast({
        title: '❌ Ошибка отправки',
        description: result.error || 'Попробуйте позже',
        variant: 'destructive'
      });
    }
  };

  const handleOpenContentEditor = (article: Article) => {
    setEditingContentId(article.id);
    setEditForm({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content || '',
      category: article.category,
      readTime: article.readTime || ''
    });
  };

  const handleSaveContent = () => {
    if (!editingContentId) return;

    if (!editForm.title.trim() || !editForm.excerpt.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Заголовок и описание обязательны',
        variant: 'destructive'
      });
      return;
    }

    const storedContent = localStorage.getItem('article_content_overrides');
    const contentOverrides = storedContent ? JSON.parse(storedContent) : {};

    contentOverrides[editingContentId] = {
      title: editForm.title,
      excerpt: editForm.excerpt,
      content: editForm.content,
      category: editForm.category,
      readTime: editForm.readTime
    };

    localStorage.setItem('article_content_overrides', JSON.stringify(contentOverrides));
    
    setEditingContentId(null);
    loadArticles();

    toast({
      title: '✅ Контент обновлён',
      description: 'Изменения сохранены и видны на сайте'
    });
  };

  const handleCancelEdit = () => {
    setEditingContentId(null);
    setEditForm({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      readTime: ''
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Не задана';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const isPublishDatePassed = (dateString?: string) => {
    if (!dateString) return false;
    const publishDate = new Date(dateString);
    publishDate.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return publishDate <= today;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon name="Lock" className="text-white" size={32} />
            </div>
            <CardTitle className="text-center text-2xl">Панель администратора</CardTitle>
            <CardDescription className="text-center">
              Управление публикацией статей блога
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="password"
                placeholder="Введите пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-center"
              />
              <Button type="submit" className="w-full">
                <Icon name="LogIn" className="mr-2" size={18} />
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Управление статьями</h1>
            <p className="text-gray-600">Настройка дат публикации и рассылки</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <Icon name="LogOut" className="mr-2" size={18} />
            Выйти
          </Button>
        </div>

        <div className="grid gap-4">
          {articles.map((article) => {
            const isEditing = editingId === article.id;
            const isPassed = isPublishDatePassed(article.publishDate);
            
            return (
              <Card key={article.id} className="bg-white">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <Badge variant="secondary" className="mt-1">
                          ID {article.id}
                        </Badge>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{article.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{article.excerpt}</p>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-blue-100 text-blue-700">
                              {article.category}
                            </Badge>
                            {article.published ? (
                              <Badge className="bg-green-100 text-green-700">
                                <Icon name="CheckCircle" size={14} className="mr-1" />
                                Опубликовано
                              </Badge>
                            ) : (
                              <Badge className="bg-orange-100 text-orange-700">
                                <Icon name="Clock" size={14} className="mr-1" />
                                Ожидает
                              </Badge>
                            )}
                            {isPassed && !article.published && (
                              <Badge className="bg-yellow-100 text-yellow-700">
                                <Icon name="AlertTriangle" size={14} className="mr-1" />
                                Дата прошла
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="flex gap-2 mt-4">
                          <Input
                            type="date"
                            value={newDate}
                            onChange={(e) => setNewDate(e.target.value)}
                            className="flex-1"
                          />
                          <Button onClick={() => handleSaveDate(article.id)} size="sm">
                            <Icon name="Save" size={16} className="mr-1" />
                            Сохранить
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setEditingId(null);
                              setNewDate('');
                            }}
                            size="sm"
                          >
                            Отмена
                          </Button>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-600 mt-2">
                          <span className="font-semibold">Дата публикации:</span> {formatDate(article.publishDate)}
                        </div>
                      )}
                    </div>

                    <div className="flex lg:flex-col gap-2 lg:min-w-[200px]">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingId(article.id);
                          setNewDate(article.publishDate || '');
                        }}
                        className="flex-1"
                      >
                        <Icon name="Calendar" size={16} className="mr-1" />
                        Изменить дату
                      </Button>
                      
                      <Button
                        variant={article.published ? "secondary" : "default"}
                        size="sm"
                        onClick={() => handleTogglePublished(article.id, article.published || false)}
                        className="flex-1"
                      >
                        <Icon name={article.published ? "EyeOff" : "Eye"} size={16} className="mr-1" />
                        {article.published ? 'Скрыть' : 'Опубликовать'}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenContentEditor(article)}
                        className="flex-1"
                      >
                        <Icon name="Edit" size={16} className="mr-1" />
                        Редактировать текст
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendNewsletter(article)}
                        className="flex-1"
                      >
                        <Icon name="Send" size={16} className="mr-1" />
                        Отправить рассылку
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Info" className="text-blue-600" size={24} />
              Справка
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Дата публикации:</strong> Статья автоматически появится в блоге, когда наступит указанная дата</p>
            <p><strong>Опубликовать сейчас:</strong> Статья станет видна немедленно, независимо от даты</p>
            <p><strong>Редактировать текст:</strong> Изменить заголовок, описание и содержимое статьи</p>
            <p><strong>Отправить рассылку:</strong> Отправить email всем подписчикам о новой статье</p>
            <p><strong>Автоматическая рассылка:</strong> Email отправляется автоматически при первом показе новой статьи</p>
          </CardContent>
        </Card>

        <Dialog open={editingContentId !== null} onOpenChange={(open) => !open && handleCancelEdit()}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Редактирование статьи</DialogTitle>
              <DialogDescription>
                Изменения сохраняются в localStorage и не затрагивают исходный код
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Icon name="FileText" size={16} />
                  Заголовок статьи
                </label>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Введите заголовок"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Icon name="Tag" size={16} />
                    Категория
                  </label>
                  <Input
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    placeholder="Советы, Финансы, Программы..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Icon name="Clock" size={16} />
                    Время чтения
                  </label>
                  <Input
                    value={editForm.readTime}
                    onChange={(e) => setEditForm({ ...editForm, readTime: e.target.value })}
                    placeholder="5 мин"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Icon name="AlignLeft" size={16} />
                  Краткое описание (excerpt)
                </label>
                <Textarea
                  value={editForm.excerpt}
                  onChange={(e) => setEditForm({ ...editForm, excerpt: e.target.value })}
                  placeholder="Краткое описание статьи для карточки"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Icon name="Code" size={16} />
                    Полный текст (HTML)
                  </label>
                  <Badge variant="secondary" className="text-xs">
                    Поддерживается HTML: h3, p, ul, ol, li, strong
                  </Badge>
                </div>
                <Textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  placeholder="Полный HTML-контент статьи"
                  rows={15}
                  className="font-mono text-sm"
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <Icon name="Info" size={16} className="text-blue-600" />
                  Подсказки по HTML
                </h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• <code className="bg-white px-1 rounded">&lt;h3&gt;Заголовок&lt;/h3&gt;</code> — заголовок раздела</li>
                  <li>• <code className="bg-white px-1 rounded">&lt;p&gt;Текст&lt;/p&gt;</code> — абзац текста</li>
                  <li>• <code className="bg-white px-1 rounded">&lt;strong&gt;Важно&lt;/strong&gt;</code> — жирный текст</li>
                  <li>• <code className="bg-white px-1 rounded">&lt;ul&gt;&lt;li&gt;Пункт&lt;/li&gt;&lt;/ul&gt;</code> — маркированный список</li>
                  <li>• <code className="bg-white px-1 rounded">&lt;ol&gt;&lt;li&gt;Пункт&lt;/li&gt;&lt;/ol&gt;</code> — нумерованный список</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleSaveContent} className="flex-1">
                  <Icon name="Save" className="mr-2" size={18} />
                  Сохранить изменения
                </Button>
                <Button variant="outline" onClick={handleCancelEdit}>
                  <Icon name="X" className="mr-2" size={18} />
                  Отменить
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
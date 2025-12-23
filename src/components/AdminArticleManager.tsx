import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
}

const ADMIN_PASSWORD = 'ipoteka2025';

export default function AdminArticleManager() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newDate, setNewDate] = useState('');
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

    const articlesWithOverrides = blogArticles.map(article => ({
      ...article,
      publishDate: overrides[article.id]?.publishDate || article.publishDate,
      published: overrides[article.id]?.published !== undefined 
        ? overrides[article.id].published 
        : article.published
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
            <p><strong>Отправить рассылку:</strong> Отправить email всем подписчикам о новой статье</p>
            <p><strong>Автоматическая рассылка:</strong> Email отправляется автоматически при первом показе новой статьи</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

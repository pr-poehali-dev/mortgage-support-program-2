import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import { blogArticles } from '@/data/mortgageData';
import { sendNewsletter } from '@/utils/sendNewsletter';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminArticleCard from '@/components/admin/AdminArticleCard';
import AdminArticleEditor from '@/components/admin/AdminArticleEditor';

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

  const handleLogin = () => {
    setIsAuthenticated(true);
    loadArticles();
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
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
    return <AdminLoginForm onLogin={handleLogin} adminPassword={ADMIN_PASSWORD} />;
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
          {articles.map((article) => (
            <AdminArticleCard
              key={article.id}
              article={article}
              isEditing={editingId === article.id}
              newDate={newDate}
              onSetNewDate={setNewDate}
              onStartEditDate={(articleId, currentDate) => {
                setEditingId(articleId);
                setNewDate(currentDate || '');
              }}
              onSaveDate={handleSaveDate}
              onCancelEditDate={() => {
                setEditingId(null);
                setNewDate('');
              }}
              onTogglePublished={handleTogglePublished}
              onOpenContentEditor={handleOpenContentEditor}
              onSendNewsletter={handleSendNewsletter}
              formatDate={formatDate}
              isPublishDatePassed={isPublishDatePassed}
            />
          ))}
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

        <AdminArticleEditor
          isOpen={editingContentId !== null}
          editForm={editForm}
          onFormChange={setEditForm}
          onSave={handleSaveContent}
          onCancel={handleCancelEdit}
        />
      </div>
    </div>
  );
}

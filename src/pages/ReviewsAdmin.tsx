import { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Review {
  id: number;
  author_name: string;
  rating: number;
  review_text: string;
  review_date: string;
  source: string;
  is_approved: boolean;
  created_at: string;
}

const REVIEWS_API = 'https://functions.poehali.dev/e9b4d624-81cd-46f6-b82b-59f9d89e033b';

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editForm, setEditForm] = useState({ author_name: '', rating: 5, review_text: '' });
  const { toast } = useToast();

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
      fetchReviews(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchReviews = async (adminToken: string) => {
    try {
      const response = await fetch(`${REVIEWS_API}?admin=true`, {
        headers: {
          'X-Admin-Token': adminToken,
        },
      });

      if (response.status === 403) {
        toast({
          title: 'Ошибка',
          description: 'Неверный токен доступа',
          variant: 'destructive',
        });
        setIsAuthenticated(false);
        localStorage.removeItem('admin_token');
        return;
      }

      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить отзывы',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('admin_token', token);
    setIsAuthenticated(true);
    fetchReviews(token);
  };

  const handleApprove = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(REVIEWS_API, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token,
        },
        body: JSON.stringify({
          id,
          is_approved: !currentStatus,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: `Отзыв ${!currentStatus ? 'одобрен' : 'скрыт'}`,
        });
        fetchReviews(token);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить отзыв',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот отзыв?')) return;

    try {
      const response = await fetch(REVIEWS_API, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token,
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Отзыв удалён',
        });
        fetchReviews(token);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить отзыв',
        variant: 'destructive',
      });
    }
  };

  const handleEditClick = (review: Review) => {
    setEditingReview(review);
    setEditForm({
      author_name: review.author_name,
      rating: review.rating,
      review_text: review.review_text,
    });
  };

  const handleEditSave = async () => {
    if (!editingReview) return;

    try {
      const response = await fetch(REVIEWS_API, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': token,
        },
        body: JSON.stringify({
          id: editingReview.id,
          ...editForm,
        }),
      });

      if (response.ok) {
        toast({
          title: 'Успешно',
          description: 'Отзыв обновлён',
        });
        setEditingReview(null);
        fetchReviews(token);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить отзыв',
        variant: 'destructive',
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Админ-панель отзывов</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Токен доступа
                </label>
                <Input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Введите токен"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Войти
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 flex items-center justify-center">
        <div>Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Управление отзывами</h1>
          <Button
            variant="outline"
            onClick={() => {
              localStorage.removeItem('admin_token');
              setIsAuthenticated(false);
            }}
          >
            Выйти
          </Button>
        </div>

        <div className="grid gap-4">
          {reviews.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Нет отзывов
              </CardContent>
            </Card>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} className={review.is_approved ? '' : 'border-yellow-400'}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{review.author_name}</span>
                        <div className="flex gap-1">{renderStars(review.rating)}</div>
                        {!review.is_approved && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                            На модерации
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(review.created_at).toLocaleString('ru-RU')}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">{review.review_text}</p>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(review)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={review.is_approved ? 'outline' : 'default'}
                        onClick={() => handleApprove(review.id, review.is_approved)}
                      >
                        {review.is_approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(review.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <Dialog open={!!editingReview} onOpenChange={() => setEditingReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать отзыв</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Имя</label>
              <Input
                value={editForm.author_name}
                onChange={(e) => setEditForm({ ...editForm, author_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Оценка</label>
              <Input
                type="number"
                min="1"
                max="5"
                value={editForm.rating}
                onChange={(e) => setEditForm({ ...editForm, rating: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Текст отзыва</label>
              <Textarea
                value={editForm.review_text}
                onChange={(e) => setEditForm({ ...editForm, review_text: e.target.value })}
                rows={5}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleEditSave} className="flex-1">
                Сохранить
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingReview(null)}
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

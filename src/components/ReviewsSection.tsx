import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import ReviewsSchema from '@/components/ReviewsSchema';

const REVIEWS_API = 'https://functions.poehali.dev/e9b4d624-81cd-46f6-b82b-59f9d89e033b';

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

export default function ReviewsSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    author_name: '',
    rating: 5,
    review_text: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(REVIEWS_API);
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(REVIEWS_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Спасибо за отзыв!',
          description: 'Ваш отзыв будет опубликован после модерации',
        });
        setFormData({ author_name: '', rating: 5, review_text: '' });
        fetchReviews();
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить отзыв',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-8 sm:py-12 bg-gradient-to-b from-background to-primary/5">
      <ReviewsSchema />
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">
          Отзывы клиентов
        </h2>

        {reviews.length > 0 && (
          <div className="mb-8 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.slice(0, 6).map((review) => (
                <Card key={review.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{review.author_name}</h4>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Icon
                            key={star}
                            name="Star"
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-4">
                      {review.review_text}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.review_date).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto">
          <div className="w-full order-2 lg:order-1">
            <div className="relative w-full h-[500px] overflow-hidden">
              <iframe
                className="w-full h-full border border-gray-200 rounded-lg box-border"
                src="https://yandex.ru/maps-reviews-widget/81713615933?comments"
                title="Отзывы на Яндекс.Картах"
              />
              <a
                href="https://yandex.ru/maps/org/arendodatel/81713615933/"
                target="_blank"
                rel="noopener noreferrer"
                className="box-border no-underline text-[#b3b3b3] text-[10px] font-[YS_Text,sans-serif] px-5 py-0 absolute bottom-2 w-full text-center left-0 overflow-hidden text-ellipsis block max-h-[14px] whitespace-nowrap"
              >
                Арендодатель на карте Севастополя — Яндекс Карты
              </a>
            </div>
          </div>

          <div className="w-full order-1 lg:order-2">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-2xl font-bold mb-2">Оставьте отзыв</h3>
                <p className="text-muted-foreground mb-6">
                  Поделитесь вашим мнением о нашей работе
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ваше имя
                    </label>
                    <Input
                      value={formData.author_name}
                      onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                      placeholder="Иван Иванов"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Оценка
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="transition-transform hover:scale-110"
                        >
                          <Icon
                            name="Star"
                            className={`w-8 h-8 ${
                              star <= formData.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Ваш отзыв
                    </label>
                    <Textarea
                      value={formData.review_text}
                      onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
                      placeholder="Расскажите о вашем опыте работы с нами..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
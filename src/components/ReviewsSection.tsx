import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

const REVIEWS_API = 'https://functions.poehali.dev/e9b4d624-81cd-46f6-b82b-59f9d89e033b';

export default function ReviewsSection() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    author_name: '',
    rating: 5,
    review_text: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <section className="py-16 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
          Отзывы клиентов
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="w-full">
            <div className="relative w-full" style={{ height: '800px', overflow: 'hidden' }}>
              <iframe
                style={{
                  width: '100%',
                  height: '100%',
                  border: '1px solid #e6e6e6',
                  borderRadius: '8px',
                  boxSizing: 'border-box'
                }}
                src="https://yandex.ru/maps-reviews-widget/81713615933?comments"
                title="Отзывы на Яндекс.Картах"
              />
              <a
                href="https://yandex.ru/maps/org/arendodatel/81713615933/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  boxSizing: 'border-box',
                  textDecoration: 'none',
                  color: '#b3b3b3',
                  fontSize: '10px',
                  fontFamily: 'YS Text,sans-serif',
                  padding: '0 20px',
                  position: 'absolute',
                  bottom: '8px',
                  width: '100%',
                  textAlign: 'center',
                  left: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: 'block',
                  maxHeight: '14px',
                  whiteSpace: 'nowrap'
                }}
              >
                Арендодатель на карте Севастополя — Яндекс Карты
              </a>
            </div>
          </div>

          <div className="w-full">
            <Card>
              <CardContent className="p-6">
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
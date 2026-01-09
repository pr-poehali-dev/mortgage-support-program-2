import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Review {
  id: number;
  author_name: string;
  rating: number;
  review_text: string;
  review_date: string;
  source: string;
}

const REVIEWS_API = 'https://functions.poehali.dev/e9b4d624-81cd-46f6-b82b-59f9d89e033b';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(REVIEWS_API);
      const data = await response.json();
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            Отзывы клиентов
          </h2>
          <div className="text-center text-muted-foreground">Загрузка...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          Отзывы клиентов
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Более 500 довольных клиентов доверили нам решение своих ипотечных вопросов
        </p>

        {reviews.length === 0 ? (
          <div className="text-center text-muted-foreground">
            Пока нет отзывов. Будьте первым!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex gap-1">{renderStars(review.rating)}</div>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-4">
                    {review.review_text}
                  </p>
                  
                  <div className="border-t pt-4">
                    <p className="font-semibold text-sm">{review.author_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(review.review_date)}
                    </p>
                    {review.source === 'yandex' && (
                      <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                        Яндекс.Карты
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <a
            href="https://yandex.ru/maps/org/arendodatel/81713615933"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm"
          >
            Больше отзывов на Яндекс.Картах →
          </a>
        </div>
      </div>
    </section>
  );
}

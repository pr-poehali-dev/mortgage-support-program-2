import { useEffect, useState } from 'react';

const REVIEWS_API = 'https://functions.poehali.dev/e9b4d624-81cd-46f6-b82b-59f9d89e033b';

interface Review {
  id: number;
  author_name: string;
  rating: number;
  review_text: string;
  review_date: string;
}

export default function ReviewsSchema() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(REVIEWS_API);
        if (response.ok) {
          const data = await response.json();
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error('Failed to fetch reviews for schema:', error);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;

    const ratings = reviews.map(r => r.rating);
    const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Ипотека Крым - Арендодатель",
      "description": "Ипотечный центр в Севастополе и Крыму. Помощь в получении ипотеки по государственным программам поддержки. Семейная, IT, военная, сельская ипотека от 0.1%",
      "image": "https://cdn.poehali.dev/files/с дескриптором черный вариант (2).png",
      "url": "https://ипотекакрым.рф",
      "telephone": "+7-978-128-18-50",
      "email": "ipoteka_krym@mail.ru",
      "address": {
        "@type": "PostalAddress",
        "addressRegion": "Крым",
        "addressLocality": "Севастополь",
        "addressCountry": "RU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "44.952116",
        "longitude": "34.102417"
      },
      "priceRange": "$$",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": averageRating.toFixed(1),
        "reviewCount": reviews.length,
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": reviews.slice(0, 10).map(review => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": review.author_name
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": review.rating.toString(),
          "bestRating": "5",
          "worstRating": "1"
        },
        "reviewBody": review.review_text,
        "datePublished": review.review_date
      }))
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(localBusinessSchema);
    script.id = 'reviews-schema';
    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById('reviews-schema');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [reviews]);

  return null;
}

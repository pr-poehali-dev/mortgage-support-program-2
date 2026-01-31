import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShareButton from '@/components/ShareButton';
import SEO from '@/components/SEO';
import PropertyGallery from '@/components/property/PropertyGallery';
import PropertyInfo from '@/components/property/PropertyInfo';
import PropertyActions from '@/components/property/PropertyActions';
import PropertyRelatedLinks from '@/components/property/PropertyRelatedLinks';

const PROPERTIES_URL = 'https://functions.poehali.dev/616c095a-7986-4278-8e36-03ef6cdf517d';

interface Property {
  id: number;
  slug?: string;
  title: string;
  type: string;
  property_category: string;
  operation: string;
  price: number;
  location: string;
  area?: number;
  rooms?: number;
  floor?: number;
  total_floors?: number;
  land_area?: number;
  photo_url?: string;
  photos?: string[];
  description?: string;
  phone?: string;
  contact_name?: string;
  rutube_link?: string;
  building_type?: string;
  renovation?: string;
  bathroom?: string;
  balcony?: string;
  furniture?: boolean;
  pets_allowed?: boolean;
  children_allowed?: boolean;
  latitude?: number;
  longitude?: number;
}

export default function PropertyView() {
  const { id: slugOrId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (slugOrId) {
      fetchProperty();
    } else {
      setError('Неверная ссылка на объект');
    }
  }, [slugOrId]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError('');
      
      const isNumeric = /^\d+$/.test(slugOrId || '');
      const queryParam = isNumeric ? `id=${slugOrId}` : `slug=${slugOrId}`;
      const url = `${PROPERTIES_URL}?${queryParam}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.property) {
        setProperty(data.property);
      } else {
        setError('Объект не найден');
      }
    } catch (err) {
      setError('Ошибка загрузки объекта');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
        <div className="text-center">
          <Icon name="Loader2" size={64} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10 p-4">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 text-red-600">
              <Icon name="AlertCircle" size={24} />
              <h2 className="text-xl font-bold">Объект не найден</h2>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/')} className="w-full">
              <Icon name="ArrowLeft" size={16} />
              Вернуться к каталогу
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
        <div className="text-center">
          <p className="text-gray-600">Объект не найден</p>
          <button onClick={() => navigate('/')} className="mt-4 bg-primary text-white px-4 py-2 rounded">Вернуться на главную</button>
        </div>
      </div>
    );
  }

  const photos = property.photos || (property.photo_url ? [property.photo_url] : []);
  const isLand = property.property_category === 'land' || property.type === 'land';

  const operationType = property.operation === 'sale' ? 'Продажа' : property.operation === 'rent' ? 'Аренда' : 'Посуточная аренда';
  const priceText = property.price.toLocaleString('ru-RU');
  const seoTitle = `${property.title} | ${operationType} за ${priceText} ₽ | Арендодатель`;
  const seoDescription = `${operationType}: ${property.title} в ${property.location}. Цена: ${priceText} ₽${property.area ? `, площадь ${property.area} м²` : ''}${property.rooms ? `, ${property.rooms} комн.` : ''}. Звоните: +7 978 128-18-50`;
  const seoImage = photos.length > 0 ? photos[0] : 'https://cdn.poehali.dev/projects/1379efae-15a5-489f-bda0-505b22ad3d6a/files/4d093a65-2fb8-4f42-bd03-2748bab0d832.jpg';
  const canonicalUrl = `https://ипотекакрым.рф/property/${property.slug || property.id}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": property.operation === 'sale' ? 'RealEstateListing' : 'RentAction',
    "name": property.title,
    "description": property.description || seoDescription,
    "url": canonicalUrl,
    "image": photos,
    "offers": {
      "@type": "Offer",
      "price": property.price,
      "priceCurrency": "RUB",
      "availability": "https://schema.org/InStock"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location,
      "addressCountry": "RU"
    },
    ...(property.area && {
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": property.area,
        "unitCode": "MTK"
      }
    }),
    ...(property.rooms && { "numberOfRooms": property.rooms }),
    ...(property.floor && { "floorLevel": property.floor })
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
      <SEO
        title={seoTitle}
        description={seoDescription}
        ogImage={seoImage}
        canonicalUrl={canonicalUrl}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="container mx-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
        <Breadcrumbs />
        {/* Хедер с кнопкой назад */}
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <Button onClick={() => navigate('/')} variant="outline" className="gap-1.5 sm:gap-2 text-sm">
            <Icon name="ArrowLeft" size={16} />
            <span className="hidden sm:inline">Назад к объектам</span>
            <span className="sm:hidden">Назад</span>
          </Button>
          <ShareButton title={property.title} text={`${property.title} - ${property.price.toLocaleString('ru-RU')} ₽`} />
        </div>

        {/* Основная информация */}
        <Card>
          <CardHeader className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-3xl mb-2 font-bold">{property.title}</h1>
                <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                  <Icon name="MapPin" size={16} />
                  <span>{property.location}</span>
                </div>
              </div>
              <div className="sm:text-right">
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  {property.price.toLocaleString('ru-RU')} ₽
                </div>
                {property.operation && (
                  <div className="mt-1 text-xs sm:text-sm text-gray-600">
                    {property.operation === 'sale' ? 'Продажа' : property.operation === 'rent' ? 'Аренда' : 'Посуточно'}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
            {/* Галерея фото */}
            <PropertyGallery photos={photos} title={property.title} />

            {/* Информация об объекте */}
            <PropertyInfo property={property} />

            {/* Кнопки действий */}
            <PropertyActions 
              isLand={isLand}
              phone={property.phone}
              contactName={property.contact_name}
              title={property.title}
              price={property.price}
            />
          </CardContent>
        </Card>

        {/* Связанные страницы */}
        <PropertyRelatedLinks />
      </div>
    </div>
  );
}
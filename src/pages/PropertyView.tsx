import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import OptimizedImage from '@/components/OptimizedImage';

const PROPERTIES_URL = 'https://functions.poehali.dev/616c095a-7986-4278-8e36-03ef6cdf517d';

interface Property {
  id: number;
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
}

export default function PropertyView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${PROPERTIES_URL}?id=${id}`);
      const data = await response.json();
      
      if (data.success && data.property) {
        setProperty(data.property);
      } else {
        alert('Объект не найден');
        navigate('/');
      }
    } catch (err) {
      console.error('Error fetching property:', err);
      alert('Ошибка загрузки объекта');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
        <Icon name="Loader2" size={64} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const photos = property.photos || (property.photo_url ? [property.photo_url] : []);
  const isLand = property.property_category === 'land' || property.type === 'land';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
      <div className="container mx-auto p-3 sm:p-4 space-y-4 sm:space-y-6">
        {/* Хедер с кнопкой назад */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button onClick={() => navigate('/')} variant="outline" className="gap-1.5 sm:gap-2 text-sm">
            <Icon name="ArrowLeft" size={16} />
            <span className="hidden sm:inline">Назад к объектам</span>
            <span className="sm:hidden">Назад</span>
          </Button>
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
            {photos.length > 0 && (
              <div className="space-y-2 sm:space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video cursor-pointer group" onClick={() => setIsFullscreen(true)}>
                  <OptimizedImage 
                    src={photos[currentPhotoIndex]} 
                    alt={property.title}
                    className="w-full h-full"
                    objectFit="contain"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                    <div className="bg-white/90 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                      <Icon name="Maximize2" size={24} className="text-gray-800" />
                    </div>
                  </div>
                  {photos.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentPhotoIndex((currentPhotoIndex - 1 + photos.length) % photos.length);
                        }}
                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all touch-manipulation z-10"
                      >
                        <Icon name="ChevronLeft" size={20} className="sm:w-6 sm:h-6" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentPhotoIndex((currentPhotoIndex + 1) % photos.length);
                        }}
                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg transition-all touch-manipulation z-10"
                      >
                        <Icon name="ChevronRight" size={20} className="sm:w-6 sm:h-6" />
                      </button>
                      <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                        {currentPhotoIndex + 1} / {photos.length}
                      </div>
                    </>
                  )}
                </div>
                
                {photos.length > 1 && (
                  <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-10 gap-1.5 sm:gap-2">
                    {photos.map((photo, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`aspect-square rounded-md sm:rounded-lg overflow-hidden border-2 transition-all touch-manipulation ${
                          index === currentPhotoIndex ? 'border-primary scale-95' : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <OptimizedImage src={photo} alt={`${index + 1}`} className="w-full h-full" objectFit="cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Характеристики */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 py-3 sm:py-4 border-y">
              {property.area && (
                <div className="flex items-center gap-2">
                  <Icon name="Home" size={20} className="text-primary" />
                  <div>
                    <div className="text-sm text-gray-600">Площадь</div>
                    <div className="font-semibold">{property.area} м²</div>
                  </div>
                </div>
              )}
              {property.rooms && (
                <div className="flex items-center gap-2">
                  <Icon name="DoorOpen" size={20} className="text-primary" />
                  <div>
                    <div className="text-sm text-gray-600">Комнат</div>
                    <div className="font-semibold">{property.rooms}</div>
                  </div>
                </div>
              )}
              {property.floor && (
                <div className="flex items-center gap-2">
                  <Icon name="Building" size={20} className="text-primary" />
                  <div>
                    <div className="text-sm text-gray-600">Этаж</div>
                    <div className="font-semibold">{property.floor} из {property.total_floors}</div>
                  </div>
                </div>
              )}
              {property.land_area && (
                <div className="flex items-center gap-2">
                  <Icon name="TreePine" size={20} className="text-primary" />
                  <div>
                    <div className="text-sm text-gray-600">Участок</div>
                    <div className="font-semibold">{property.land_area} сот.</div>
                  </div>
                </div>
              )}
            </div>

            {/* Описание */}
            {property.description && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Описание</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
              </div>
            )}

            {/* Карта */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Местоположение</h3>
              <a 
                href={`https://yandex.ru/maps/?text=${encodeURIComponent(property.location)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden border hover:opacity-90 transition-opacity cursor-pointer"
              >
                <iframe
                  src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(property.location)}&z=14`}
                  width="100%"
                  height="400"
                  style={{ position: 'relative', pointerEvents: 'none', border: 0 }}
                  title={`Карта: ${property.location}`}
                />
              </a>
            </div>

            {/* Видео Rutube */}
            {property.rutube_link && (
              <div>
                <h3 className="font-semibold text-lg mb-3">Видео обзор</h3>
                <div className="rounded-lg overflow-hidden border bg-gray-100 aspect-video flex items-center justify-center">
                  <a
                    href={property.rutube_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-3 p-6 hover:scale-105 transition-transform"
                  >
                    <Icon name="Video" size={48} className="text-primary" />
                    <span className="text-lg font-semibold text-gray-700">Смотреть видео на Rutube</span>
                  </a>
                </div>
              </div>
            )}

            {/* Кнопки действий */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <Button size="lg" className="gap-2">
                <Icon name="CreditCard" size={20} />
                Купить в ипотеку
              </Button>
              
              {isLand ? (
                <Button size="lg" variant="outline" className="gap-2">
                  <Icon name="HardHat" size={20} />
                  Строительство под ключ
                </Button>
              ) : (
                <Button size="lg" variant="outline" className="gap-2">
                  <Icon name="Paintbrush" size={20} />
                  Отделочные работы
                </Button>
              )}
              
              <Button size="lg" variant="secondary" className="gap-2" asChild>
                <a href={`tel:${property.phone || '+79781281850'}`}>
                  <Icon name="Phone" size={20} />
                  {property.contact_name ? `Позвонить ${property.contact_name}` : 'Позвонить'}
                </a>
              </Button>
            </div>
            
            {/* Кнопки репоста */}
            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">Поделиться объявлением</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    const url = window.location.href;
                    const text = `${property.title} - ${property.price.toLocaleString('ru-RU')} ₽`;
                    window.open(`https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank');
                  }}
                >
                  <Icon name="Share2" size={16} />
                  ВКонтакте
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    const url = window.location.href;
                    const text = `${property.title} - ${property.price.toLocaleString('ru-RU')} ₽`;
                    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
                  }}
                >
                  <Icon name="Send" size={16} />
                  Telegram
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    const url = window.location.href;
                    const text = `${property.title} - ${property.price.toLocaleString('ru-RU')} ₽`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                  }}
                >
                  <Icon name="MessageCircle" size={16} />
                  WhatsApp
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    const url = window.location.href;
                    const text = `${property.title} - ${property.price.toLocaleString('ru-RU')} ₽`;
                    window.open(`https://connect.ok.ru/offer?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`, '_blank');
                  }}
                >
                  <Icon name="Circle" size={16} />
                  Одноклассники
                </Button>
                
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Ссылка скопирована!');
                  }}
                >
                  <Icon name="Copy" size={16} />
                  Скопировать ссылку
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Полноэкранный просмотр */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setIsFullscreen(false)}
        >
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all z-10"
          >
            <Icon name="X" size={24} />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img 
              src={photos[currentPhotoIndex]} 
              alt={property.title}
              className="max-w-full max-h-full object-contain"
            />
            
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentPhotoIndex((currentPhotoIndex - 1 + photos.length) % photos.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all"
                >
                  <Icon name="ChevronLeft" size={32} />
                </button>
                <button
                  onClick={() => setCurrentPhotoIndex((currentPhotoIndex + 1) % photos.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-all"
                >
                  <Icon name="ChevronRight" size={32} />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
                  {currentPhotoIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const AVITO_API_URL = 'https://functions.poehali.dev/0363e1df-5e38-47b1-83ba-6d01b09d4e99';

export default function CatalogTab() {
  const [catalogFilter, setCatalogFilter] = useState('all');
  const [catalogSort, setCatalogSort] = useState<'default' | 'price-asc' | 'price-desc'>('default');
  const [realEstateObjects, setRealEstateObjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAvitoListings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(AVITO_API_URL);
        const data = await response.json();
        
        if (data.success) {
          setRealEstateObjects(data.listings || []);
        } else {
          setError(data.error || 'Не удалось загрузить объявления');
        }
      } catch (err) {
        setError('Ошибка подключения к Avito API');
        console.error('Avito API error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvitoListings();
  }, []);

  const getCatalogCounts = () => {
    return {
      all: realEstateObjects.length,
      apartment: realEstateObjects.filter(obj => obj.type === 'apartment').length,
      house: realEstateObjects.filter(obj => obj.type === 'house').length,
      land: realEstateObjects.filter(obj => obj.type === 'land').length,
      commercial: realEstateObjects.filter(obj => obj.type === 'commercial').length
    };
  };

  const catalogCounts = getCatalogCounts();

  return (
    <TabsContent value="catalog" className="space-y-4 sm:space-y-6">
      <div className="mb-4 sm:mb-6">
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Мои объекты на Авито</h2>
            {!loading && !error && (
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                Найдено объектов: {realEstateObjects.length}
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="default"
            onClick={() => window.open('https://www.avito.ru/brands/i92755531', '_blank')}
            className="gap-2"
          >
            <Icon name="ExternalLink" size={18} />
            <span className="hidden sm:inline">Открыть профиль</span>
          </Button>
        </div>

        {!loading && !error && realEstateObjects.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={catalogFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setCatalogFilter('all')}
              className="gap-2"
            >
              <Icon name="LayoutGrid" size={16} />
              Все ({catalogCounts.all})
            </Button>
            {catalogCounts.apartment > 0 && (
              <Button 
                variant={catalogFilter === 'apartment' ? 'default' : 'outline'}
                onClick={() => setCatalogFilter('apartment')}
                className="gap-2"
              >
                <Icon name="Building2" size={16} />
                Квартиры ({catalogCounts.apartment})
              </Button>
            )}
            {catalogCounts.house > 0 && (
              <Button 
                variant={catalogFilter === 'house' ? 'default' : 'outline'}
                onClick={() => setCatalogFilter('house')}
                className="gap-2"
              >
                <Icon name="Home" size={16} />
                Дома ({catalogCounts.house})
              </Button>
            )}
            {catalogCounts.land > 0 && (
              <Button 
                variant={catalogFilter === 'land' ? 'default' : 'outline'}
                onClick={() => setCatalogFilter('land')}
                className="gap-2"
              >
                <Icon name="TreePine" size={16} />
                Участки ({catalogCounts.land})
              </Button>
            )}
            {catalogCounts.commercial > 0 && (
              <Button 
                variant={catalogFilter === 'commercial' ? 'default' : 'outline'}
                onClick={() => setCatalogFilter('commercial')}
                className="gap-2"
              >
                <Icon name="Building" size={16} />
                Коммерция ({catalogCounts.commercial})
              </Button>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="mb-4 animate-spin">
            <Icon name="Loader2" size={64} className="mx-auto text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Загружаю объявления...</h3>
          <p className="text-gray-500">Подключаюсь к Avito API</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <Icon name="AlertCircle" size={64} className="mx-auto text-red-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Ошибка загрузки</h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <Icon name="RefreshCw" size={18} />
            Попробовать снова
          </Button>
        </div>
      ) : realEstateObjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <Icon name="Building2" size={64} className="mx-auto text-gray-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Нет активных объявлений</h3>
          <p className="text-gray-500 mb-6">Добавьте объявления на Avito, и они появятся здесь</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {realEstateObjects
            .filter(obj => catalogFilter === 'all' || obj.type === catalogFilter)
            .sort((a, b) => {
              if (catalogSort === 'price-asc') return a.price - b.price;
              if (catalogSort === 'price-desc') return b.price - a.price;
              return 0;
            })
            .map((obj) => (
            <Card key={obj.id} className="hover:shadow-xl transition-all cursor-pointer group overflow-hidden">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={obj.image} 
                  alt={obj.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <p className="font-bold text-primary text-lg">{obj.price.toLocaleString('ru-RU')} ₽</p>
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{obj.title}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Icon name="MapPin" size={14} />
                  <span>{obj.location}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3 text-sm">
                  {obj.area && (
                    <div className="flex items-center gap-1.5">
                      <Icon name="Home" size={16} className="text-gray-500" />
                      <span className="font-medium">{obj.area} м²</span>
                    </div>
                  )}
                  {obj.rooms && (
                    <div className="flex items-center gap-1.5">
                      <Icon name="DoorOpen" size={16} className="text-gray-500" />
                      <span className="font-medium">{obj.rooms} комн.</span>
                    </div>
                  )}
                  {obj.floor && (
                    <div className="flex items-center gap-1.5">
                      <Icon name="Layers" size={16} className="text-gray-500" />
                      <span className="font-medium">{obj.floor}/{obj.totalFloors} этаж</span>
                    </div>
                  )}
                  {obj.landArea && (
                    <div className="flex items-center gap-1.5">
                      <Icon name="TreePine" size={16} className="text-gray-500" />
                      <span className="font-medium">{obj.landArea} сот.</span>
                    </div>
                  )}
                  {obj.floors && !obj.floor && (
                    <div className="flex items-center gap-1.5">
                      <Icon name="Layers" size={16} className="text-gray-500" />
                      <span className="font-medium">{obj.floors} этажа</span>
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">{obj.description}</p>

                <div className="flex flex-wrap gap-2">
                  {obj.features.slice(0, 3).map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {obj.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{obj.features.length - 3}
                    </Badge>
                  )}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      Подробнее
                      <Icon name="ArrowRight" className="ml-2" size={16} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{obj.title}</DialogTitle>
                      <DialogDescription className="flex items-center gap-2">
                        <Icon name="MapPin" size={16} />
                        {obj.location}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="relative h-64 rounded-lg overflow-hidden">
                        <img 
                          src={obj.image} 
                          alt={obj.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                        <div>
                          <p className="text-sm text-gray-600">Цена</p>
                          <p className="text-3xl font-bold text-primary">{obj.price.toLocaleString('ru-RU')} ₽</p>
                        </div>
                        <Button size="lg" asChild>
                          <a href="tel:+79781281850">
                            <Icon name="Phone" className="mr-2" />
                            Позвонить
                          </a>
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {obj.area && (
                          <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <Icon name="Home" className="mx-auto mb-2 text-primary" size={24} />
                            <p className="text-sm text-gray-600">Площадь</p>
                            <p className="font-bold">{obj.area} м²</p>
                          </div>
                        )}
                        {obj.rooms && (
                          <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <Icon name="DoorOpen" className="mx-auto mb-2 text-primary" size={24} />
                            <p className="text-sm text-gray-600">Комнат</p>
                            <p className="font-bold">{obj.rooms}</p>
                          </div>
                        )}
                        {obj.floor && (
                          <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <Icon name="Layers" className="mx-auto mb-2 text-primary" size={24} />
                            <p className="text-sm text-gray-600">Этаж</p>
                            <p className="font-bold">{obj.floor}/{obj.totalFloors}</p>
                          </div>
                        )}
                        {obj.landArea && (
                          <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <Icon name="TreePine" className="mx-auto mb-2 text-primary" size={24} />
                            <p className="text-sm text-gray-600">Участок</p>
                            <p className="font-bold">{obj.landArea} сот.</p>
                          </div>
                        )}
                        {obj.floors && !obj.floor && (
                          <div className="p-3 bg-gray-50 rounded-lg text-center">
                            <Icon name="Layers" className="mx-auto mb-2 text-primary" size={24} />
                            <p className="text-sm text-gray-600">Этажность</p>
                            <p className="font-bold">{obj.floors}</p>
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Описание</h4>
                        <p className="text-gray-700">{obj.description}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3">Особенности</h4>
                        <div className="flex flex-wrap gap-2">
                          {obj.features.map((feature, idx) => (
                            <Badge key={idx} variant="secondary">
                              <Icon name="Check" className="mr-1" size={14} />
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="border-t pt-4">
                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
                          <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <Icon name="MessageCircle" className="text-primary" size={20} />
                            Интересует этот объект?
                          </h4>
                          <p className="text-gray-700 mb-4">Свяжитесь с нами для получения дополнительной информации и организации просмотра</p>
                          <div className="flex flex-wrap gap-2">
                            {obj.avitoLink && (
                              <Button asChild size="lg" className="w-full sm:w-auto">
                                <a href={obj.avitoLink} target="_blank" rel="noopener noreferrer">
                                  <Icon name="ExternalLink" className="mr-2" size={16} />
                                  Смотреть на Avito
                                </a>
                              </Button>
                            )}
                            <Button asChild variant={obj.avitoLink ? 'outline' : 'default'}>
                              <a href="https://t.me/ipoteka_krym_rf" target="_blank" rel="noopener noreferrer">
                                <Icon name="MessageCircle" className="mr-2" size={16} />
                                Telegram
                              </a>
                            </Button>
                            <Button variant="outline" asChild>
                              <a href="tel:+79781281850">
                                <Icon name="Phone" className="mr-2" size={16} />
                                Позвонить
                              </a>
                            </Button>
                            <Button variant="outline" asChild>
                              <a href="https://agencies.domclick.ru/agent/5621837?utm_source=partnerhub&utm_content=profile" target="_blank" rel="noopener noreferrer">
                                <Icon name="Home" className="mr-2" size={16} />
                                Домклик
                              </a>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            ))}
        </div>
      )}
    </TabsContent>
  );
}
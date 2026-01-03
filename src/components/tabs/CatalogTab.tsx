import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { realEstateObjects } from '@/data/mortgageData';

export default function CatalogTab() {
  const [catalogFilter, setCatalogFilter] = useState('all');
  const [catalogSort, setCatalogSort] = useState<'default' | 'price-asc' | 'price-desc'>('default');

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
        <div className="mb-3 sm:mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Каталог объектов</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">Актуальные предложения недвижимости</p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-3">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={catalogFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCatalogFilter('all')}
            >
              <Icon name="Grid2X2" className="mr-2" size={16} />
              Все <Badge variant={catalogFilter === 'all' ? 'secondary' : 'outline'} className="ml-2">{catalogCounts.all}</Badge>
            </Button>
            <Button
              variant={catalogFilter === 'apartment' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCatalogFilter('apartment')}
            >
              <Icon name="Building" className="mr-2" size={16} />
              Квартиры <Badge variant={catalogFilter === 'apartment' ? 'secondary' : 'outline'} className="ml-2">{catalogCounts.apartment}</Badge>
            </Button>
            <Button
              variant={catalogFilter === 'house' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCatalogFilter('house')}
            >
              <Icon name="Home" className="mr-2" size={16} />
              Дома <Badge variant={catalogFilter === 'house' ? 'secondary' : 'outline'} className="ml-2">{catalogCounts.house}</Badge>
            </Button>
            <Button
              variant={catalogFilter === 'land' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCatalogFilter('land')}
            >
              <Icon name="TreePine" className="mr-2" size={16} />
              Земля <Badge variant={catalogFilter === 'land' ? 'secondary' : 'outline'} className="ml-2">{catalogCounts.land}</Badge>
            </Button>
            <Button
              variant={catalogFilter === 'commercial' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCatalogFilter('commercial')}
            >
              <Icon name="Briefcase" className="mr-2" size={16} />
              Коммерция <Badge variant={catalogFilter === 'commercial' ? 'secondary' : 'outline'} className="ml-2">{catalogCounts.commercial}</Badge>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Icon name="ArrowUpDown" size={16} className="text-gray-500" />
            <select
              value={catalogSort}
              onChange={(e) => setCatalogSort(e.target.value as 'default' | 'price-asc' | 'price-desc')}
              className="px-3 py-1.5 text-sm border rounded-lg bg-white hover:border-primary transition-colors cursor-pointer"
            >
              <option value="default">По умолчанию</option>
              <option value="price-asc">Цена: по возрастанию</option>
              <option value="price-desc">Цена: по убыванию</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-700">
            Найдено объектов: <span className="font-bold text-primary">
              {realEstateObjects.filter(obj => catalogFilter === 'all' || obj.type === catalogFilter).length}
            </span>
          </p>
          <Button
            variant="default"
            size="sm"
            onClick={() => window.open('https://www.avito.ru/brands/i92755531', '_blank')}
            className="gap-2"
          >
            <Icon name="ExternalLink" size={16} />
            Смотреть все объекты на Авито
          </Button>
        </div>
      </div>

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
                            {obj.domclickUrl && (
                              <Button asChild size="lg" className="w-full sm:w-auto">
                                <a href={obj.domclickUrl} target="_blank" rel="noopener noreferrer">
                                  <Icon name="ShoppingCart" className="mr-2" size={16} />
                                  Купить в ипотеку в Сбере
                                </a>
                              </Button>
                            )}
                            <Button asChild variant={obj.domclickUrl ? 'outline' : 'default'}>
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
                            {!obj.domclickUrl && (
                              <Button variant="outline" asChild>
                                <a href="https://agencies.domclick.ru/agent/5621837?utm_source=partnerhub&utm_content=profile" target="_blank" rel="noopener noreferrer">
                                  <Icon name="ExternalLink" className="mr-2" size={16} />
                                  Домклик
                                </a>
                              </Button>
                            )}
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
    </TabsContent>
  );
}
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { Client } from './crm-types';
import { toast } from '@/hooks/use-toast';

const PARSER_URL = 'https://functions.poehali.dev/8a76033d-5e48-47a6-96a5-65daa67f63e7';
const CRM_URL = 'https://functions.poehali.dev/e72807e0-91d8-4a57-992b-41b5cc49df17';

interface Listing {
  external_id: string;
  source: string;
  title: string;
  price: number | null;
  location: string;
  area: number | null;
  rooms: number | null;
  floor: number | null;
  total_floors: number | null;
  property_type: string;
  operation: string;
  photo_url: string;
  url: string;
  description: string;
}

interface CRMParserTabProps {
  clients: Client[];
}

export default function CRMParserTab({ clients }: CRMParserTabProps) {
  const [city, setCity] = useState('Севастополь');
  const [operation, setOperation] = useState('sale');
  const [propType, setPropType] = useState('apartment');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [rooms, setRooms] = useState('');

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchDone, setSearchDone] = useState(false);
  const [sourceInfo, setSourceInfo] = useState('');

  const [savingId, setSavingId] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string>('');

  const handleSearch = async () => {
    setLoading(true);
    setSearchDone(false);
    try {
      const params = new URLSearchParams({ action: 'search', city, operation, type: propType });
      if (minPrice) params.set('min_price', minPrice);
      if (maxPrice) params.set('max_price', maxPrice);
      if (rooms && rooms !== 'any') params.set('rooms', rooms);

      const res = await fetch(`${PARSER_URL}?${params}`);
      const data = await res.json();
      setListings(data.listings || []);
      setSourceInfo(data.source === 'cache' ? 'из кэша' : 'свежие данные');
      setSearchDone(true);
    } catch {
      toast({ title: 'Ошибка поиска', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToClient = async (listing: Listing) => {
    if (!selectedClientId) {
      toast({ title: 'Выберите клиента', variant: 'destructive' });
      return;
    }
    setSavingId(listing.external_id);
    try {
      const res = await fetch(`${PARSER_URL}?action=save_to_client`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: parseInt(selectedClientId), listing }),
      });
      const data = await res.json();
      if (data.success) {
        const client = clients.find(c => c.id === parseInt(selectedClientId));
        toast({ title: `Добавлено в подборку клиента ${client?.name || ''}` });
      }
    } catch {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    } finally {
      setSavingId(null);
    }
  };

  const fmt = (n: number | null) => n ? new Intl.NumberFormat('ru').format(n) + ' ₽' : '—';

  return (
    <div className="space-y-5">
      {/* Фильтры */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
            <div className="space-y-1">
              <Label className="text-xs">Город</Label>
              <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Севастополь" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Операция</Label>
              <Select value={operation} onValueChange={setOperation}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Продажа</SelectItem>
                  <SelectItem value="rent">Аренда</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Тип</Label>
              <Select value={propType} onValueChange={setPropType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Квартира</SelectItem>
                  <SelectItem value="house">Дом</SelectItem>
                  <SelectItem value="land">Земля</SelectItem>
                  <SelectItem value="commercial">Коммерческая</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Комнат</Label>
              <Select value={rooms} onValueChange={setRooms}>
                <SelectTrigger><SelectValue placeholder="Любое" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Любое</SelectItem>
                  <SelectItem value="0">Студия</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Цена от — до, ₽</Label>
              <div className="flex gap-1">
                <Input placeholder="от" value={minPrice} onChange={e => setMinPrice(e.target.value)} className="w-1/2" />
                <Input placeholder="до" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="w-1/2" />
              </div>
            </div>
            <Button onClick={handleSearch} disabled={loading} className="h-9">
              {loading
                ? <><Icon name="Loader2" size={15} className="animate-spin mr-1.5" />Поиск...</>
                : <><Icon name="Search" size={15} className="mr-1.5" />Найти</>
              }
            </Button>
          </div>

          {/* Выбор клиента для добавления */}
          <div className="mt-3 pt-3 border-t flex items-center gap-3 flex-wrap">
            <Icon name="UserPlus" size={16} className="text-gray-400" />
            <span className="text-sm text-gray-500">Добавлять найденные объекты к клиенту:</span>
            <Select value={selectedClientId} onValueChange={setSelectedClientId}>
              <SelectTrigger className="w-56 h-8 text-sm">
                <SelectValue placeholder="Выберите клиента..." />
              </SelectTrigger>
              <SelectContent>
                {clients.map(c => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name} {c.phone && `· ${c.phone}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Результаты */}
      {searchDone && (
        <div className="flex items-center justify-between text-sm text-gray-500 px-1">
          <span>Найдено: <b>{listings.length}</b> объявлений ({sourceInfo})</span>
          <div className="flex gap-1">
            {Array.from(new Set(listings.map(l => l.source))).map(s => (
              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
            ))}
          </div>
        </div>
      )}

      {!searchDone && !loading && (
        <div className="text-center py-16 text-gray-400">
          <Icon name="Building2" size={56} className="mx-auto mb-3 opacity-20" />
          <p className="text-lg font-medium text-gray-500">Поиск объявлений по недвижимости</p>
          <p className="text-sm mt-1">Задайте параметры и нажмите «Найти»</p>
          <p className="text-xs mt-2 text-gray-400">Источники: Авито · ЦИАН · Яндекс.Недвижимость</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {listings.map(listing => (
          <Card key={listing.external_id} className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-0">
              {listing.photo_url && (
                <img
                  src={listing.photo_url}
                  alt={listing.title}
                  className="w-full h-40 object-cover rounded-t-lg"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <div className="p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-2">{listing.title}</p>
                  <Badge variant="outline" className="text-xs flex-shrink-0">{listing.source}</Badge>
                </div>
                <p className="text-lg font-bold text-primary">{fmt(listing.price)}</p>
                <div className="flex flex-wrap gap-1.5 text-xs text-gray-500">
                  {listing.location && (
                    <span className="flex items-center gap-1">
                      <Icon name="MapPin" size={11} />{listing.location}
                    </span>
                  )}
                  {listing.area && <span>{listing.area} м²</span>}
                  {listing.rooms != null && (
                    <span>{listing.rooms === 0 ? 'Студия' : `${listing.rooms} комн.`}</span>
                  )}
                  {listing.floor && listing.total_floors && (
                    <span>{listing.floor}/{listing.total_floors} эт.</span>
                  )}
                </div>
                {listing.description && (
                  <p className="text-xs text-gray-400 line-clamp-2">{listing.description}</p>
                )}
                <div className="flex gap-2 pt-1">
                  {listing.url && (
                    <a href={listing.url} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <Button variant="outline" size="sm" className="w-full h-7 text-xs">
                        <Icon name="ExternalLink" size={11} className="mr-1" />
                        Открыть
                      </Button>
                    </a>
                  )}
                  <Button
                    size="sm"
                    className="flex-1 h-7 text-xs"
                    disabled={savingId === listing.external_id || !selectedClientId}
                    onClick={() => handleSaveToClient(listing)}
                  >
                    {savingId === listing.external_id
                      ? <Icon name="Loader2" size={11} className="animate-spin mr-1" />
                      : <Icon name="UserPlus" size={11} className="mr-1" />
                    }
                    В подборку
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

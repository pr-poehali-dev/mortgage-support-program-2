import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Client } from './crm-types';

interface ClientProperty {
  id: number;
  client_id: number;
  title: string;
  property_type: string;
  address: string;
  area: number | null;
  rooms: number | null;
  floor: number | null;
  total_floors: number | null;
  price: number | null;
  description: string;
  photo_url: string;
  created_at: string;
}

interface ClientDetailDialogProps {
  client: Client | null;
  open: boolean;
  onClose: () => void;
  apiUrl: string;
}

const PROPERTY_TYPES: Record<string, string> = {
  apartment: 'Квартира',
  house: 'Дом',
  land: 'Земельный участок',
  commercial: 'Коммерческая',
  room: 'Комната',
  newbuild: 'Новостройка',
};

const emptyForm = {
  title: '', property_type: 'apartment', address: '',
  area: '', rooms: '', floor: '', total_floors: '',
  price: '', description: '', photo_url: '',
};

export default function ClientDetailDialog({ client, open, onClose, apiUrl }: ClientDetailDialogProps) {
  const [properties, setProperties] = useState<ClientProperty[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingProperty, setAddingProperty] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [showProposal, setShowProposal] = useState(false);

  useEffect(() => {
    if (open && client) fetchProperties();
  }, [open, client]);

  const fetchProperties = async () => {
    if (!client) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}?action=client_properties&client_id=${client.id}`);
      const data = await res.json();
      setProperties(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client) return;
    setSaving(true);
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_property',
          client_id: client.id,
          ...form,
          area: form.area ? parseFloat(form.area) : null,
          rooms: form.rooms ? parseInt(form.rooms) : null,
          floor: form.floor ? parseInt(form.floor) : null,
          total_floors: form.total_floors ? parseInt(form.total_floors) : null,
          price: form.price ? parseFloat(form.price.replace(/\s/g, '')) : null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setForm({ ...emptyForm });
        setAddingProperty(false);
        fetchProperties();
      }
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price: number | null) =>
    price ? new Intl.NumberFormat('ru-RU').format(price) + ' ₽' : '';

  const generateProposal = () => {
    if (!client || properties.length === 0) return;
    const lines: string[] = [];
    lines.push(`ПОДБОРКА ОБЪЕКТОВ ДЛЯ: ${client.name}`);
    lines.push(`Телефон: ${client.phone || '—'}`);
    lines.push(`Email: ${client.email || '—'}`);
    lines.push(`Дата: ${new Date().toLocaleDateString('ru-RU')}`);
    lines.push('');
    lines.push('═'.repeat(50));
    lines.push('');

    properties.forEach((p, i) => {
      lines.push(`${i + 1}. ${p.title}`);
      if (p.property_type) lines.push(`   Тип: ${PROPERTY_TYPES[p.property_type] || p.property_type}`);
      if (p.address) lines.push(`   Адрес: ${p.address}`);
      const details: string[] = [];
      if (p.area) details.push(`${p.area} м²`);
      if (p.rooms) details.push(`${p.rooms} комн.`);
      if (p.floor && p.total_floors) details.push(`${p.floor}/${p.total_floors} эт.`);
      else if (p.floor) details.push(`${p.floor} эт.`);
      if (details.length) lines.push(`   ${details.join(' · ')}`);
      if (p.price) lines.push(`   Цена: ${formatPrice(p.price)}`);
      if (p.description) lines.push(`   ${p.description}`);
      lines.push('');
    });

    lines.push('─'.repeat(50));
    lines.push('Арендодатель — ваш надёжный партнёр в сфере недвижимости');

    const text = lines.join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Подборка_${client.name}_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!client) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold">
              {client.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <div>{client.name}</div>
              <div className="text-sm font-normal text-gray-500 flex items-center gap-3">
                {client.phone && <span className="flex items-center gap-1"><Icon name="Phone" size={12} />{client.phone}</span>}
                {client.email && <span className="flex items-center gap-1"><Icon name="Mail" size={12} />{client.email}</span>}
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Icon name="Building2" size={18} />
              Объекты ({properties.length})
            </h3>
            <div className="flex gap-2">
              {properties.length > 0 && (
                <Button size="sm" variant="outline" onClick={generateProposal}>
                  <Icon name="FileDown" size={14} className="mr-1.5" />
                  Скачать предложение
                </Button>
              )}
              <Button size="sm" onClick={() => setAddingProperty(v => !v)}>
                <Icon name="Plus" size={14} className="mr-1.5" />
                Добавить объект
              </Button>
            </div>
          </div>

          {addingProperty && (
            <Card className="border border-primary/30 bg-primary/5">
              <CardContent className="p-4">
                <form onSubmit={handleAddProperty} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 space-y-1">
                      <Label>Название объекта <span className="text-red-500">*</span></Label>
                      <Input
                        placeholder="2-комн. квартира на Ленина 15"
                        value={form.title}
                        onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Тип</Label>
                      <Select value={form.property_type} onValueChange={v => setForm(f => ({ ...f, property_type: v }))}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(PROPERTY_TYPES).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label>Цена (₽)</Label>
                      <Input
                        placeholder="5 000 000"
                        value={form.price}
                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Label>Адрес</Label>
                      <Input
                        placeholder="г. Симферополь, ул. Ленина, 15"
                        value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Площадь (м²)</Label>
                      <Input
                        type="number"
                        placeholder="52"
                        value={form.area}
                        onChange={e => setForm(f => ({ ...f, area: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Комнат</Label>
                      <Input
                        type="number"
                        placeholder="2"
                        value={form.rooms}
                        onChange={e => setForm(f => ({ ...f, rooms: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Этаж</Label>
                      <Input
                        type="number"
                        placeholder="5"
                        value={form.floor}
                        onChange={e => setForm(f => ({ ...f, floor: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label>Этажей в доме</Label>
                      <Input
                        type="number"
                        placeholder="9"
                        value={form.total_floors}
                        onChange={e => setForm(f => ({ ...f, total_floors: e.target.value }))}
                      />
                    </div>
                    <div className="col-span-2 space-y-1">
                      <Label>Описание</Label>
                      <Textarea
                        placeholder="Хорошее состояние, рядом школа и магазины..."
                        value={form.description}
                        onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => setAddingProperty(false)}>
                      Отмена
                    </Button>
                    <Button type="submit" size="sm" className="flex-1" disabled={saving || !form.title.trim()}>
                      {saving ? <Icon name="Loader2" size={14} className="animate-spin mr-1" /> : null}
                      Сохранить объект
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <div className="text-center py-8 text-gray-400">
              <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-2" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Icon name="Building2" size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Объекты ещё не добавлены</p>
            </div>
          ) : (
            <div className="space-y-3">
              {properties.map(p => (
                <Card key={p.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900">{p.title}</span>
                          {p.property_type && (
                            <Badge variant="outline" className="text-xs">
                              {PROPERTY_TYPES[p.property_type] || p.property_type}
                            </Badge>
                          )}
                        </div>
                        {p.address && (
                          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                            <Icon name="MapPin" size={12} />{p.address}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap text-sm text-gray-600">
                          {p.area && <span>{p.area} м²</span>}
                          {p.rooms && <span>{p.rooms} комн.</span>}
                          {p.floor && <span>{p.floor}{p.total_floors ? `/${p.total_floors}` : ''} эт.</span>}
                        </div>
                        {p.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{p.description}</p>}
                      </div>
                      {p.price && (
                        <div className="text-right flex-shrink-0">
                          <span className="text-lg font-bold text-green-700">{formatPrice(p.price)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {properties.length > 0 && (
            <div className="pt-2 border-t">
              <Button className="w-full" onClick={generateProposal}>
                <Icon name="FileDown" size={16} className="mr-2" />
                Сформировать и скачать предложение ({properties.length} объ.)
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Property {
  id: number;
  title: string;
  type: string;
  operation: string;
  price: number;
  location: string;
  phone: string;
  contact_name: string;
  created_at: string;
  is_active: boolean;
}

export default function AdminUserPropertiesSection() {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProperties = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/c13f7cf0-9c81-4e73-8cf7-36ee7f18cee3');
      if (!response.ok) throw new Error('Ошибка загрузки');
      
      const data = await response.json();
      const userProperties = (data.properties || []).filter((p: Property) => !p.is_active);
      setProperties(userProperties);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить объявления',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleApprove = async (propertyId: number) => {
    try {
      const property = properties.find(p => p.id === propertyId);
      if (!property) return;

      const response = await fetch('https://functions.poehali.dev/c13f7cf0-9c81-4e73-8cf7-36ee7f18cee3', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...property, id: propertyId, is_active: true }),
      });

      if (!response.ok) throw new Error('Ошибка публикации');

      toast({
        title: 'Успешно',
        description: 'Объявление опубликовано на сайте',
      });

      loadProperties();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось опубликовать объявление',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (propertyId: number) => {
    if (!confirm('Удалить объявление?')) return;

    try {
      const response = await fetch(
        `https://functions.poehali.dev/c13f7cf0-9c81-4e73-8cf7-36ee7f18cee3?id=${propertyId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Ошибка удаления');

      toast({
        title: 'Успешно',
        description: 'Объявление удалено',
      });

      loadProperties();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить объявление',
        variant: 'destructive',
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Mail" size={24} />
            Объявления с сайта
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Icon name="Loader2" className="animate-spin" size={32} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Mail" size={24} />
            Объявления с сайта
          </div>
          <Button onClick={loadProperties} variant="outline" size="sm">
            <Icon name="RefreshCw" size={16} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {properties.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Icon name="Inbox" size={48} className="mx-auto mb-2 opacity-50" />
            <p>Нет новых объявлений</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Заголовок</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Цена</TableHead>
                  <TableHead>Контакт</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {property.title}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <div className="font-medium">
                          {property.type === 'apartment' && 'Квартира'}
                          {property.type === 'house' && 'Дом'}
                          {property.type === 'land' && 'Участок'}
                          {property.type === 'commercial' && 'Коммерция'}
                        </div>
                        <div className="text-gray-500">
                          {property.operation === 'sale' && 'Продажа'}
                          {property.operation === 'rent' && 'Аренда'}
                          {property.operation === 'daily' && 'Посуточно'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatPrice(property.price)}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <div>{property.contact_name || 'Не указано'}</div>
                        <div className="text-gray-500">{property.phone || 'Нет телефона'}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">
                      {formatDate(property.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          onClick={() => handleApprove(property.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Icon name="Check" size={16} />
                        </Button>
                        <Button
                          onClick={() => handleDelete(property.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

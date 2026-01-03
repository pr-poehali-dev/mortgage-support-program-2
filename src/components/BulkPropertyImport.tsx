import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import * as XLSX from 'xlsx';

const PROPERTIES_URL = 'https://functions.poehali.dev/d286a6ac-5f97-4343-9332-1ee6a1e9ad53';

interface PropertyRow {
  title: string;
  type: string;
  price: number;
  location: string;
  area?: number;
  rooms?: number;
  floor?: number;
  total_floors?: number;
  land_area?: number;
  photo_url?: string;
  description?: string;
  property_link?: string;
}

interface BulkPropertyImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function BulkPropertyImport({ open, onOpenChange, onSuccess }: BulkPropertyImportProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState<{ success: number; failed: number; errors: string[] }>({
    success: 0,
    failed: 0,
    errors: []
  });

  const downloadTemplate = () => {
    const template = [
      {
        'Название*': 'Квартира 2 комнаты',
        'Тип* (apartment/house/land/commercial)': 'apartment',
        'Цена*': 5000000,
        'Адрес*': 'Севастополь, ул. Ленина 10',
        'Площадь (м²)': 65,
        'Комнаты': 2,
        'Этаж': 5,
        'Этажей в доме': 9,
        'Участок (сот.)': '',
        'URL фото': 'https://example.com/photo.jpg',
        'Описание': 'Уютная квартира в центре города',
        'Ссылка на объявление': ''
      },
      {
        'Название*': 'Дом с участком',
        'Тип* (apartment/house/land/commercial)': 'house',
        'Цена*': 12000000,
        'Адрес*': 'Севастополь, пос. Учкуевка',
        'Площадь (м²)': 120,
        'Комнаты': 4,
        'Этаж': '',
        'Этажей в доме': '',
        'Участок (сот.)': 10,
        'URL фото': '',
        'Описание': 'Дом у моря с большим участком',
        'Ссылка на объявление': ''
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Недвижимость');
    
    ws['!cols'] = [
      { wch: 30 },
      { wch: 40 },
      { wch: 12 },
      { wch: 40 },
      { wch: 12 },
      { wch: 10 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 50 },
      { wch: 60 },
      { wch: 50 }
    ];

    XLSX.writeFile(wb, 'Шаблон_импорта_недвижимости.xlsx');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setResults({ success: 0, failed: 0, errors: [] });

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const properties: PropertyRow[] = jsonData.map((row: any) => {
        const typeMapping: Record<string, string> = {
          'квартира': 'apartment',
          'apartment': 'apartment',
          'дом': 'house',
          'house': 'house',
          'участок': 'land',
          'land': 'land',
          'коммерция': 'commercial',
          'commercial': 'commercial'
        };

        const rawType = (row['Тип* (apartment/house/land/commercial)'] || row['Тип'] || 'apartment').toString().toLowerCase().trim();
        const propertyType = typeMapping[rawType] || 'apartment';

        return {
          title: row['Название*'] || row['Название'] || '',
          type: propertyType,
          price: Number(row['Цена*'] || row['Цена'] || 0),
          location: row['Адрес*'] || row['Адрес'] || '',
          area: row['Площадь (м²)'] ? Number(row['Площадь (м²)']) : undefined,
          rooms: row['Комнаты'] ? Number(row['Комнаты']) : undefined,
          floor: row['Этаж'] ? Number(row['Этаж']) : undefined,
          total_floors: row['Этажей в доме'] ? Number(row['Этажей в доме']) : undefined,
          land_area: row['Участок (сот.)'] ? Number(row['Участок (сот.)']) : undefined,
          photo_url: row['URL фото'] || undefined,
          description: row['Описание'] || '',
          property_link: row['Ссылка на объявление'] || ''
        };
      });

      setProgress({ current: 0, total: properties.length });

      let successCount = 0;
      let failedCount = 0;
      const errorMessages: string[] = [];

      for (let i = 0; i < properties.length; i++) {
        const property = properties[i];
        
        if (!property.title || !property.price || !property.location) {
          errorMessages.push(`Строка ${i + 2}: пропущены обязательные поля (название, цена или адрес)`);
          failedCount++;
          setProgress({ current: i + 1, total: properties.length });
          continue;
        }

        try {
          const response = await fetch(PROPERTIES_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...property,
              features: [],
              price_type: 'total'
            })
          });

          const data = await response.json();

          if (data.success) {
            successCount++;
          } else {
            failedCount++;
            errorMessages.push(`Строка ${i + 2} (${property.title}): ${data.error || 'Неизвестная ошибка'}`);
          }
        } catch (err) {
          failedCount++;
          errorMessages.push(`Строка ${i + 2} (${property.title}): ${err instanceof Error ? err.message : 'Ошибка сети'}`);
        }

        setProgress({ current: i + 1, total: properties.length });
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setResults({ success: successCount, failed: failedCount, errors: errorMessages });

      if (successCount > 0) {
        onSuccess();
      }
    } catch (err) {
      alert('Ошибка чтения файла: ' + (err instanceof Error ? err.message : 'Неизвестная ошибка'));
    } finally {
      setUploading(false);
    }
  };

  const resetDialog = () => {
    setProgress({ current: 0, total: 0 });
    setResults({ success: 0, failed: 0, errors: [] });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Массовая загрузка объектов</DialogTitle>
        </DialogHeader>

        {!uploading && progress.total === 0 && (
          <div className="space-y-4">
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-2 text-sm">
                    <p className="font-semibold text-blue-900">Как использовать:</p>
                    <ol className="list-decimal list-inside space-y-1 text-blue-800">
                      <li>Скачайте шаблон Excel файла</li>
                      <li>Заполните данные по объектам недвижимости</li>
                      <li>Сохраните файл и загрузите обратно</li>
                    </ol>
                    <p className="text-blue-700 mt-2">
                      <span className="font-semibold">Обязательные поля:</span> Название, Тип, Цена, Адрес
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={downloadTemplate}
              variant="outline"
              className="w-full gap-2"
              size="lg"
            >
              <Icon name="Download" size={18} />
              Скачать шаблон Excel
            </Button>

            <div className="relative">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
                id="bulk-upload-input"
              />
              <label htmlFor="bulk-upload-input">
                <Button asChild size="lg" className="w-full gap-2">
                  <span className="cursor-pointer">
                    <Icon name="Upload" size={18} />
                    Загрузить заполненный файл
                  </span>
                </Button>
              </label>
            </div>
          </div>
        )}

        {uploading && (
          <div className="py-8 space-y-4">
            <div className="text-center">
              <Icon name="Loader2" size={48} className="mx-auto animate-spin text-primary mb-4" />
              <p className="text-lg font-semibold">Загружаю объекты...</p>
              <p className="text-gray-600 mt-2">
                {progress.current} из {progress.total}
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {!uploading && progress.total > 0 && (
          <div className="space-y-4">
            <Card className={results.success > 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Успешно загружено:</span>
                    <span className="text-2xl font-bold text-green-600">{results.success}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Ошибки:</span>
                    <span className="text-2xl font-bold text-red-600">{results.failed}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {results.errors.length > 0 && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <p className="font-semibold text-yellow-900 flex items-center gap-2">
                      <Icon name="AlertTriangle" size={18} />
                      Детали ошибок:
                    </p>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {results.errors.map((error, index) => (
                        <p key={index} className="text-sm text-yellow-800">
                          • {error}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Button onClick={resetDialog} className="w-full gap-2" size="lg">
              <Icon name="Check" size={18} />
              Готово
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

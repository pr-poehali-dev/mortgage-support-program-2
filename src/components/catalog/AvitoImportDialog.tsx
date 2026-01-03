import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface AvitoImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  importUrl: string;
  setImportUrl: (url: string) => void;
  importing: boolean;
  onImport: () => void;
}

export default function AvitoImportDialog({
  open,
  onOpenChange,
  importUrl,
  setImportUrl,
  importing,
  onImport
}: AvitoImportDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Импорт объявлений с Avito</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Вставьте ссылку на любое ваше объявление на Avito.
              <br />
              Система автоматически найдет все объявления из вашего профиля.
            </p>
            <Input
              placeholder="https://www.avito.ru/sevastopol/..."
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              disabled={importing}
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={onImport} 
              disabled={!importUrl || importing}
              className="flex-1 gap-2"
            >
              {importing ? (
                <>
                  <Icon name="Loader2" size={18} className="animate-spin" />
                  Импортирую...
                </>
              ) : (
                <>
                  <Icon name="Download" size={18} />
                  Импортировать
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={importing}
            >
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

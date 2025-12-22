import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface AdminEmailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportEmail: string;
  setReportEmail: (email: string) => void;
  sendingEmail: boolean;
  onSendEmail: () => void;
  period: number;
}

export default function AdminEmailDialog({
  open,
  onOpenChange,
  reportEmail,
  setReportEmail,
  sendingEmail,
  onSendEmail,
  period
}: AdminEmailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Icon name="Mail" className="text-white" size={24} />
            </div>
            <div>
              <DialogTitle className="text-2xl">Отправить отчет</DialogTitle>
              <DialogDescription className="mt-1">
                Excel-файл с аналитикой будет отправлен на указанный email
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="report-email">Email получателя *</Label>
            <Input
              id="report-email"
              type="email"
              placeholder="example@mail.com"
              value={reportEmail}
              onChange={(e) => setReportEmail(e.target.value)}
              className="h-12"
              autoFocus
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Icon name="FileSpreadsheet" size={16} className="text-blue-600" />
              Что будет в отчете:
            </p>
            <ul className="text-sm text-gray-700 space-y-1 ml-6 list-disc">
              <li>Сводка за {period} дней</li>
              <li>Динамика просмотров и заявок</li>
              <li>Источники трафика</li>
              <li>Популярные программы</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12"
              disabled={sendingEmail}
            >
              Отмена
            </Button>
            <Button
              onClick={onSendEmail}
              className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              disabled={sendingEmail || !reportEmail}
            >
              {sendingEmail ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                  Отправка...
                </>
              ) : (
                <>
                  <Icon name="Send" className="mr-2" size={18} />
                  Отправить
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

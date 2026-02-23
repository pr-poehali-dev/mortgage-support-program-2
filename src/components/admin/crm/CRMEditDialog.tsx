import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Request } from './crm-types';

const PIPELINE_STAGES = [
  { id: 'new', label: 'Новая заявка', color: 'bg-blue-500', icon: 'Inbox' },
  { id: 'contact', label: 'Контакт', color: 'bg-purple-500', icon: 'Phone' },
  { id: 'in_progress', label: 'В работе', color: 'bg-yellow-500', icon: 'Briefcase' },
  { id: 'showing', label: 'Показ', color: 'bg-orange-500', icon: 'Eye' },
  { id: 'negotiation', label: 'Переговоры', color: 'bg-pink-500', icon: 'Handshake' },
  { id: 'completed', label: 'Сделка', color: 'bg-green-500', icon: 'CheckCircle' },
];

interface CRMEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRequest: Request | null;
  editingStage: string;
  setEditingStage: (v: string) => void;
  editingPriority: string;
  setEditingPriority: (v: string) => void;
  editingNotes: string;
  setEditingNotes: (v: string) => void;
  onSave: () => void;
  onDelete: (id: number) => void;
}

export default function CRMEditDialog({
  open,
  onOpenChange,
  selectedRequest,
  editingStage,
  setEditingStage,
  editingPriority,
  setEditingPriority,
  editingNotes,
  setEditingNotes,
  onSave,
  onDelete,
}: CRMEditDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name="User" size={18} />
            {selectedRequest?.name}
          </DialogTitle>
        </DialogHeader>
        {selectedRequest && (
          <div className="space-y-4">
            {/* Contact info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-500 text-xs mb-1">Телефон</p>
                <a href={`tel:${selectedRequest.phone}`} className="font-semibold text-primary">
                  {selectedRequest.phone}
                </a>
              </div>
              {selectedRequest.email && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">Email</p>
                  <a href={`mailto:${selectedRequest.email}`} className="font-semibold text-primary truncate block">
                    {selectedRequest.email}
                  </a>
                </div>
              )}
              {selectedRequest.city && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">Город</p>
                  <p className="font-semibold">{selectedRequest.city}</p>
                </div>
              )}
              {selectedRequest.service_type && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-gray-500 text-xs mb-1">Услуга</p>
                  <p className="font-semibold text-primary">{selectedRequest.service_type}</p>
                </div>
              )}
              {selectedRequest.property_cost && (
                <div className="bg-green-50 rounded-lg p-3 col-span-2">
                  <p className="text-gray-500 text-xs mb-1">Стоимость объекта</p>
                  <p className="font-bold text-green-700 text-lg">
                    {new Intl.NumberFormat('ru').format(selectedRequest.property_cost)} ₽
                  </p>
                </div>
              )}
            </div>

            {selectedRequest.message && (
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Сообщение клиента</p>
                <p className="text-sm text-gray-800">{selectedRequest.message}</p>
              </div>
            )}

            {/* Stage */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Этап воронки</label>
              <div className="grid grid-cols-3 gap-2">
                {PIPELINE_STAGES.map(stage => (
                  <button
                    key={stage.id}
                    onClick={() => setEditingStage(stage.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 text-xs transition-all ${
                      editingStage === stage.id
                        ? `${stage.color} text-white border-transparent`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon name={stage.icon} size={14} />
                    {stage.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Приоритет</label>
              <div className="flex gap-2">
                {[
                  { key: 'high', label: 'Высокий', color: 'bg-red-500' },
                  { key: 'medium', label: 'Средний', color: 'bg-yellow-500' },
                  { key: 'low', label: 'Низкий', color: 'bg-gray-400' },
                ].map(p => (
                  <button
                    key={p.key}
                    onClick={() => setEditingPriority(p.key)}
                    className={`flex-1 py-2 px-3 rounded-lg border-2 text-sm transition-all ${
                      editingPriority === p.key
                        ? `${p.color} text-white border-transparent`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Комментарий</label>
              <Textarea
                placeholder="Добавить заметку по клиенту..."
                value={editingNotes}
                onChange={e => setEditingNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button className="flex-1" onClick={onSave}>
                <Icon name="Check" size={16} className="mr-1.5" />
                Сохранить
              </Button>
              <a href={`tel:${selectedRequest.phone}`}>
                <Button variant="outline" className="flex items-center gap-1.5">
                  <Icon name="Phone" size={16} />
                  Позвонить
                </Button>
              </a>
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => { onDelete(selectedRequest.id); onOpenChange(false); }}
              >
                <Icon name="Trash2" size={16} />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

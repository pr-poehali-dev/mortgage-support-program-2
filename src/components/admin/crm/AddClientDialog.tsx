import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Client } from './crm-types';

interface AddClientDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  apiUrl: string;
  editClient?: Client | null;
}

export default function AddClientDialog({ open, onClose, onSuccess, apiUrl, editClient }: AddClientDialogProps) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });
  const [loading, setLoading] = useState(false);

  const isEdit = !!editClient;

  useEffect(() => {
    if (editClient) {
      setForm({
        name: editClient.name || '',
        phone: editClient.phone || '',
        email: editClient.email || '',
        notes: editClient.notes || '',
      });
    } else {
      setForm({ name: '', phone: '', email: '', notes: '' });
    }
  }, [editClient, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    try {
      const body = isEdit
        ? { action: 'update_client', client_id: editClient!.id, ...form }
        : { action: 'create_client', ...form, source: 'crm' };

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setForm({ name: '', phone: '', email: '', notes: '' });
        onSuccess();
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon name={isEdit ? 'UserCog' : 'UserPlus'} size={20} />
            {isEdit ? 'Редактировать клиента' : 'Добавить клиента'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Имя <span className="text-red-500">*</span></Label>
            <Input
              placeholder="Иван Иванов"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label>Телефон</Label>
            <Input
              placeholder="+7 900 000 00 00"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="client@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Заметки</Label>
            <Textarea
              placeholder="Пожелания, комментарии..."
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || !form.name.trim()}>
              {loading ? <Icon name="Loader2" size={16} className="animate-spin mr-2" /> : null}
              {isEdit ? 'Сохранить' : 'Добавить'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

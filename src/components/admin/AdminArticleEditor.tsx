import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface EditForm {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
}

interface AdminArticleEditorProps {
  isOpen: boolean;
  editForm: EditForm;
  onFormChange: (form: EditForm) => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function AdminArticleEditor({
  isOpen,
  editForm,
  onFormChange,
  onSave,
  onCancel
}: AdminArticleEditorProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Редактирование статьи</DialogTitle>
          <DialogDescription>
            Изменения сохраняются в localStorage и не затрагивают исходный код
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 mt-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Icon name="FileText" size={16} />
              Заголовок статьи
            </label>
            <Input
              value={editForm.title}
              onChange={(e) => onFormChange({ ...editForm, title: e.target.value })}
              placeholder="Введите заголовок"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Icon name="Tag" size={16} />
                Категория
              </label>
              <Input
                value={editForm.category}
                onChange={(e) => onFormChange({ ...editForm, category: e.target.value })}
                placeholder="Советы, Финансы, Программы..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Icon name="Clock" size={16} />
                Время чтения
              </label>
              <Input
                value={editForm.readTime}
                onChange={(e) => onFormChange({ ...editForm, readTime: e.target.value })}
                placeholder="5 мин"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Icon name="AlignLeft" size={16} />
              Краткое описание (excerpt)
            </label>
            <Textarea
              value={editForm.excerpt}
              onChange={(e) => onFormChange({ ...editForm, excerpt: e.target.value })}
              placeholder="Краткое описание статьи для карточки"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Icon name="Code" size={16} />
                Полный текст (HTML)
              </label>
              <Badge variant="secondary" className="text-xs">
                Поддерживается HTML: h3, p, ul, ol, li, strong
              </Badge>
            </div>
            <Textarea
              value={editForm.content}
              onChange={(e) => onFormChange({ ...editForm, content: e.target.value })}
              placeholder="Полный HTML-контент статьи"
              rows={15}
              className="font-mono text-sm"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <Icon name="Info" size={16} className="text-blue-600" />
              Подсказки по HTML
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• <code className="bg-white px-1 rounded">&lt;h3&gt;Заголовок&lt;/h3&gt;</code> — заголовок раздела</li>
              <li>• <code className="bg-white px-1 rounded">&lt;p&gt;Текст&lt;/p&gt;</code> — абзац текста</li>
              <li>• <code className="bg-white px-1 rounded">&lt;strong&gt;Важно&lt;/strong&gt;</code> — жирный текст</li>
              <li>• <code className="bg-white px-1 rounded">&lt;ul&gt;&lt;li&gt;Пункт&lt;/li&gt;&lt;/ul&gt;</code> — маркированный список</li>
              <li>• <code className="bg-white px-1 rounded">&lt;ol&gt;&lt;li&gt;Пункт&lt;/li&gt;&lt;/ol&gt;</code> — нумерованный список</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onSave} className="flex-1">
              <Icon name="Save" className="mr-2" size={18} />
              Сохранить изменения
            </Button>
            <Button variant="outline" onClick={onCancel}>
              <Icon name="X" className="mr-2" size={18} />
              Отменить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

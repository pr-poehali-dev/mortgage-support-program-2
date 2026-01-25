import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShareButton from '@/components/ShareButton';
import { compressImage, fileToBase64 } from '@/utils/imageCompressor';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    documents: [] as string[]
  });

  const [submitting, setSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentDocsCount = formData.documents.length;
    const newFilesCount = files.length;
    
    if (currentDocsCount + newFilesCount > 50) {
      toast({
        title: 'Превышен лимит',
        description: `Можно загрузить максимум 50 файлов. Уже загружено: ${currentDocsCount}`,
        variant: 'destructive',
      });
      return;
    }

    setUploadingFiles(true);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const compressedFile = file.type.startsWith('image/') 
          ? await compressImage(file, 1, 1920) 
          : file;
        const base64 = await fileToBase64(compressedFile);
        
        const response = await fetch('https://functions.poehali.dev/be14ce68-1655-468e-be45-ca3e59d65813', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });

        if (!response.ok) throw new Error('Ошибка загрузки файла');

        const data = await response.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...uploadedUrls],
      }));

      toast({
        title: 'Файлы загружены',
        description: `Загружено документов: ${uploadedUrls.length}`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить файлы',
        variant: 'destructive',
      });
    } finally {
      setUploadingFiles(false);
    }
  };

  const handleRemoveFile = (url: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((item: string) => item !== url),
    }));
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.phone || !formData.email) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    if (!agreedToTerms || !agreedToPrivacy) {
      toast({
        title: 'Ошибка',
        description: 'Необходимо согласиться с правилами и политикой конфиденциальности',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/5ce9a672-9918-45c3-bbfe-9689604ecec5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          documents: formData.documents
        })
      });

      if (response.ok) {
        alert('Заявка успешно отправлена! Наш специалист свяжется с вами в ближайшее время.');
        navigate('/');
      } else {
        alert('Ошибка при отправке заявки. Попробуйте позже.');
      }
    } catch (error) {
      alert('Ошибка соединения. Проверьте интернет и попробуйте снова.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
          >
            <Icon name="ArrowLeft" className="mr-2" size={18} />
            Вернуться на главную
          </Button>
          <ShareButton />
        </div>

        <Breadcrumbs
          items={[
            { label: 'Главная', href: '/' },
            { label: 'Ипотека' },
          ]}
        />

        <div className="max-w-2xl mx-auto mt-8">
          <Card className="shadow-xl">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" className="text-white" size={24} />
                </div>
                <div>
                  <CardTitle className="text-2xl">Ипотека</CardTitle>
                  <CardDescription>Заполните форму для получения консультации по ипотеке</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Ф.И.О. *</Label>
                  <Input
                    id="fullName"
                    placeholder="Иванов Иван Иванович"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (978) 123-45-67"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Электронная почта *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.ru"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <Label>Документы (до 50 файлов)</Label>
                  <p className="text-sm text-gray-500">
                    Загрузите документы: паспорт, СНИЛС, справка о доходах, трудовая книжка и др.
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('documents')?.click()}
                      disabled={uploadingFiles || formData.documents.length >= 50}
                      className="gap-2"
                    >
                      <Icon name="Upload" size={18} />
                      {uploadingFiles ? 'Загрузка...' : 'Добавить файлы'}
                    </Button>
                    <span className="text-sm text-gray-500">
                      {formData.documents.length} / 50
                    </span>
                  </div>

                  <input
                    id="documents"
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {formData.documents.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {formData.documents.map((url, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                            {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                              <img
                                src={url}
                                alt={`Документ ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center gap-2 text-gray-400">
                                <Icon name="FileText" size={32} />
                                <span className="text-xs">Документ {index + 1}</span>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveFile(url)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <Icon name="X" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm leading-tight cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Я согласен с{' '}
                    <button
                      onClick={() => navigate('/terms')}
                      className="text-primary hover:underline"
                    >
                      правилами использования сайта
                    </button>
                  </label>
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="privacy"
                    checked={agreedToPrivacy}
                    onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
                  />
                  <label
                    htmlFor="privacy"
                    className="text-sm leading-tight cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Я согласен с{' '}
                    <button
                      onClick={() => navigate('/privacy')}
                      className="text-primary hover:underline"
                    >
                      политикой конфиденциальности
                    </button>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full h-12 text-base font-semibold"
                >
                  {submitting ? (
                    <>
                      <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" className="mr-2" size={20} />
                      Отправить заявку
                    </>
                  )}
                </Button>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 flex gap-3">
                <Icon name="Info" className="text-primary flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-gray-600">
                  После отправки заявки наш специалист свяжется с вами в течение 24 часов для уточнения деталей и консультации по ипотечным программам.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

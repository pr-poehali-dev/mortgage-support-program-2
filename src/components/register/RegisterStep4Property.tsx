import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import OptimizedImage from '@/components/OptimizedImage';

interface RegisterStep4PropertyProps {
  formData: {
    propertyType: string;
    propertyAddress: string;
    propertyCost: string;
    initialPayment: string;
    creditTerm: string;
    additionalInfo: string;
    photos: string[];
    documents: string[];
  };
  handleInputChange: (field: string, value: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: 'photos' | 'documents') => void;
  handleRemoveFile: (url: string, type: 'photos' | 'documents') => void;
  uploadingFiles: boolean;
}

export default function RegisterStep4Property({ formData, handleInputChange }: RegisterStep4PropertyProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Тип недвижимости</label>
        <select
          value={formData.propertyType}
          onChange={(e) => handleInputChange('propertyType', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="apartment">Квартира</option>
          <option value="house">Дом</option>
          <option value="townhouse">Таунхаус</option>
          <option value="land">Земельный участок</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Адрес недвижимости</label>
        <input
          type="text"
          value={formData.propertyAddress}
          onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="г. Москва, ул. Строителей, д. 10"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Стоимость недвижимости (₽)</label>
        <input
          type="number"
          value={formData.propertyCost}
          onChange={(e) => handleInputChange('propertyCost', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="5000000"
          min="0"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Первоначальный взнос (₽)</label>
        <input
          type="number"
          value={formData.initialPayment}
          onChange={(e) => handleInputChange('initialPayment', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="1000000"
          min="0"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Срок кредита (лет)</label>
        <select
          value={formData.creditTerm}
          onChange={(e) => handleInputChange('creditTerm', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="5">5 лет</option>
          <option value="10">10 лет</option>
          <option value="15">15 лет</option>
          <option value="20">20 лет</option>
          <option value="25">25 лет</option>
          <option value="30">30 лет</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Дополнительная информация</label>
        <textarea
          value={formData.additionalInfo}
          onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={4}
          placeholder="Укажите любую дополнительную информацию, которая может быть важна..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Фото недвижимости</label>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="photos-upload"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload(e, 'photos')}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('photos-upload')?.click()}
              disabled={uploadingFiles}
              className="w-full"
            >
              {uploadingFiles ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                  Загрузка...
                </>
              ) : (
                <>
                  <Icon name="ImagePlus" className="mr-2" size={18} />
                  Добавить фото
                </>
              )}
            </Button>
          </div>
          {formData.photos.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <OptimizedImage src={photo} alt={`Фото ${index + 1}`} className="w-full h-24 rounded-lg" objectFit="cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(photo, 'photos')}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Документы (паспорт, справки о доходах и т.д.)</label>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="file"
              id="documents-upload"
              accept="image/*,.pdf,.doc,.docx"
              multiple
              onChange={(e) => handleFileUpload(e, 'documents')}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('documents-upload')?.click()}
              disabled={uploadingFiles}
              className="w-full"
            >
              {uploadingFiles ? (
                <>
                  <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                  Загрузка...
                </>
              ) : (
                <>
                  <Icon name="FileText" className="mr-2" size={18} />
                  Добавить документы
                </>
              )}
            </Button>
          </div>
          {formData.documents.length > 0 && (
            <div className="space-y-2">
              {formData.documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Icon name="FileText" size={18} className="text-blue-600" />
                    <span className="text-sm text-gray-700">Документ {index + 1}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(doc, 'documents')}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Icon name="X" size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
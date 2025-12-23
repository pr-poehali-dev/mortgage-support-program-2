interface RegisterStep4PropertyProps {
  formData: {
    propertyType: string;
    propertyAddress: string;
    propertyCost: string;
    initialPayment: string;
    creditTerm: string;
    additionalInfo: string;
  };
  handleInputChange: (field: string, value: string) => void;
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
    </div>
  );
}

interface RegisterStep2PassportProps {
  formData: {
    passportSeries: string;
    passportNumber: string;
    passportDate: string;
    passportIssuer: string;
    registrationAddress: string;
    inn: string;
    snils: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

export default function RegisterStep2Passport({ formData, handleInputChange }: RegisterStep2PassportProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Серия паспорта</label>
          <input
            type="text"
            value={formData.passportSeries}
            onChange={(e) => handleInputChange('passportSeries', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="1234"
            maxLength={4}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Номер паспорта</label>
          <input
            type="text"
            value={formData.passportNumber}
            onChange={(e) => handleInputChange('passportNumber', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="567890"
            maxLength={6}
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Дата выдачи паспорта</label>
        <input
          type="date"
          value={formData.passportDate}
          onChange={(e) => handleInputChange('passportDate', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Кем выдан</label>
        <input
          type="text"
          value={formData.passportIssuer}
          onChange={(e) => handleInputChange('passportIssuer', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="ОВД Центрального района г. Москвы"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Адрес регистрации</label>
        <input
          type="text"
          value={formData.registrationAddress}
          onChange={(e) => handleInputChange('registrationAddress', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="г. Москва, ул. Ленина, д. 1, кв. 1"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ИНН *</label>
          <input
            type="text"
            value={formData.inn}
            onChange={(e) => handleInputChange('inn', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="123456789012"
            maxLength={12}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">СНИЛС *</label>
          <input
            type="text"
            value={formData.snils}
            onChange={(e) => handleInputChange('snils', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="123-456-789 00"
            required
          />
        </div>
      </div>
    </div>
  );
}
interface RegisterStep3EmploymentProps {
  formData: {
    maritalStatus: string;
    children: string;
    employment: string;
    employer: string;
    position: string;
    workExperience: string;
    monthlyIncome: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

export default function RegisterStep3Employment({ formData, handleInputChange }: RegisterStep3EmploymentProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Семейное положение</label>
        <select
          value={formData.maritalStatus}
          onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="single">Холост / Не замужем</option>
          <option value="married">Женат / Замужем</option>
          <option value="divorced">Разведен(а)</option>
          <option value="widowed">Вдовец / Вдова</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Количество детей</label>
        <select
          value={formData.children}
          onChange={(e) => handleInputChange('children', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="0">Нет</option>
          <option value="1">1 ребенок</option>
          <option value="2">2 ребенка</option>
          <option value="3">3 ребенка</option>
          <option value="4+">4 и более</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Занятость</label>
        <select
          value={formData.employment}
          onChange={(e) => handleInputChange('employment', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="employed">Работаю по найму</option>
          <option value="self-employed">Самозанятый / ИП</option>
          <option value="business">Владею бизнесом</option>
          <option value="unemployed">Не работаю</option>
        </select>
      </div>
      {formData.employment !== 'unemployed' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Место работы</label>
            <input
              type="text"
              value={formData.employer}
              onChange={(e) => handleInputChange('employer', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="ООО Компания"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Должность</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Менеджер"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Стаж работы (лет)</label>
            <input
              type="number"
              value={formData.workExperience}
              onChange={(e) => handleInputChange('workExperience', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="5"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ежемесячный доход (₽)</label>
            <input
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="80000"
              min="0"
              required
            />
          </div>
        </>
      )}
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    passportSeries: '',
    passportNumber: '',
    passportDate: '',
    passportIssuer: '',
    birthDate: '',
    birthPlace: '',
    registrationAddress: '',
    inn: '',
    snils: '',
    maritalStatus: 'single',
    children: '0',
    employment: 'employed',
    employer: '',
    position: '',
    workExperience: '',
    monthlyIncome: '',
    propertyType: 'apartment',
    propertyAddress: '',
    propertyCost: '',
    initialPayment: '',
    creditTerm: '20',
    additionalInfo: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/c46f25f9-dba9-4ecb-8f37-e3de41f8da8c', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'registration',
          ...formData,
          timestamp: new Date().toISOString()
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

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">ФИО полностью</label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => handleInputChange('fullName', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Иванов Иван Иванович"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="+7 (999) 123-45-67"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="example@mail.ru"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Дата рождения</label>
        <input
          type="date"
          value={formData.birthDate}
          onChange={(e) => handleInputChange('birthDate', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Место рождения</label>
        <input
          type="text"
          value={formData.birthPlace}
          onChange={(e) => handleInputChange('birthPlace', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="г. Москва"
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
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
          <label className="block text-sm font-medium text-gray-700 mb-2">ИНН</label>
          <input
            type="text"
            value={formData.inn}
            onChange={(e) => handleInputChange('inn', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="123456789012"
            maxLength={12}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">СНИЛС</label>
          <input
            type="text"
            value={formData.snils}
            onChange={(e) => handleInputChange('snils', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="123-456-789 00"
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
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

  const renderStep4 = () => (
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

  const steps = [
    { number: 1, title: 'Личные данные', icon: 'User' },
    { number: 2, title: 'Паспортные данные', icon: 'CreditCard' },
    { number: 3, title: 'Занятость', icon: 'Briefcase' },
    { number: 4, title: 'Недвижимость', icon: 'Home' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-50 to-primary/10">
      <div className="container mx-auto px-4 py-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <Icon name="ArrowLeft" className="mr-2" size={18} />
          Вернуться на главную
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-3">
              Регистрация на ипотеку
            </h1>
            <p className="text-gray-600">
              Заполните все шаги для подачи заявки на ипотечный кредит
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((s, index) => (
                <div key={s.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        step >= s.number
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      <Icon name={s.icon as any} size={20} />
                    </div>
                    <div className="text-xs mt-2 text-center font-medium text-gray-600">
                      {s.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-all ${
                        step > s.number ? 'bg-primary' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Шаг {step} из 4</CardTitle>
              <CardDescription>{steps[step - 1].title}</CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}

              <div className="flex items-center justify-between mt-6 pt-6 border-t">
                {step > 1 ? (
                  <Button variant="outline" onClick={prevStep}>
                    <Icon name="ChevronLeft" className="mr-2" size={18} />
                    Назад
                  </Button>
                ) : (
                  <div></div>
                )}

                {step < 4 ? (
                  <Button onClick={nextStep}>
                    Далее
                    <Icon name="ChevronRight" className="ml-2" size={18} />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={submitting}>
                    {submitting ? (
                      <>
                        <Icon name="Loader2" className="mr-2 animate-spin" size={18} />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Icon name="Send" className="mr-2" size={18} />
                        Отправить заявку
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center text-sm text-gray-600">
            <Icon name="Lock" className="inline mr-1" size={14} />
            Все ваши данные защищены и передаются по защищенному каналу
          </div>
        </div>
      </div>
    </div>
  );
}

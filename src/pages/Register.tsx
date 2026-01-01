import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import RegisterStepIndicator from '@/components/register/RegisterStepIndicator';
import RegisterStep1Personal from '@/components/register/RegisterStep1Personal';
import RegisterStep2Passport from '@/components/register/RegisterStep2Passport';
import RegisterStep3Employment from '@/components/register/RegisterStep3Employment';
import RegisterStep4Property from '@/components/register/RegisterStep4Property';

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
      const response = await fetch('https://functions.poehali.dev/5ce9a672-9918-45c3-bbfe-9689604ecec5', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          birthDate: formData.birthDate,
          birthPlace: formData.birthPlace,
          passportSeries: formData.passportSeries,
          passportNumber: formData.passportNumber,
          passportIssueDate: formData.passportDate,
          passportIssuer: formData.passportIssuer,
          registrationAddress: formData.registrationAddress,
          inn: formData.inn,
          snils: formData.snils,
          maritalStatus: formData.maritalStatus,
          childrenCount: parseInt(formData.children) || 0,
          employmentType: formData.employment,
          employer: formData.employer,
          position: formData.position,
          workExperience: formData.workExperience,
          monthlyIncome: parseFloat(formData.monthlyIncome) || 0,
          propertyType: formData.propertyType,
          propertyAddress: formData.propertyAddress,
          propertyCost: parseFloat(formData.propertyCost) || 0,
          initialPayment: parseFloat(formData.initialPayment) || 0,
          creditTerm: parseInt(formData.creditTerm) || 20,
          additionalInfo: formData.additionalInfo
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

          <RegisterStepIndicator currentStep={step} steps={steps} />

          <Card>
            <CardHeader>
              <CardTitle>Шаг {step} из 4</CardTitle>
              <CardDescription>{steps[step - 1].title}</CardDescription>
            </CardHeader>
            <CardContent>
              {step === 1 && (
                <RegisterStep1Personal 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                />
              )}
              {step === 2 && (
                <RegisterStep2Passport 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                />
              )}
              {step === 3 && (
                <RegisterStep3Employment 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                />
              )}
              {step === 4 && (
                <RegisterStep4Property 
                  formData={formData} 
                  handleInputChange={handleInputChange} 
                />
              )}

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
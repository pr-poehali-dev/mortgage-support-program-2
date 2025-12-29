import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from '@/hooks/use-toast';
import { programs } from '@/data/mortgageData';
import { trackCalculatorUsed } from '@/services/analytics';

export default function MortgageCalculator() {
  const [calcAmount, setCalcAmount] = useState([3000000]);
  const [calcDownPayment, setCalcDownPayment] = useState([20]);
  const [calcTerm, setCalcTerm] = useState([20]);
  const [selectedProgramCalc, setSelectedProgramCalc] = useState('family');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const program = programs.find(p => p.id === selectedProgramCalc);
    const rate = program?.rate || 6;
    trackCalculatorUsed(calcAmount[0], calcTerm[0], rate);
  }, [calcAmount, calcTerm, selectedProgramCalc]);

  const calculateMonthlyPayment = () => {
    const amount = calcAmount[0];
    const downPaymentPercent = calcDownPayment[0];
    const termYears = calcTerm[0];
    
    const loanAmount = amount - (amount * downPaymentPercent / 100);
    const monthlyRate = 0.06 / 12;
    const payments = termYears * 12;
    
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, payments)) / 
                          (Math.pow(1 + monthlyRate, payments) - 1);
    
    return {
      monthly: Math.round(monthlyPayment),
      total: Math.round(monthlyPayment * payments),
      loanAmount: Math.round(loanAmount),
      downPayment: Math.round(amount * downPaymentPercent / 100)
    };
  };

  const calc = calculateMonthlyPayment();

  const handleSubmitApplication = async () => {
    if (!formData.name || !formData.phone || !formData.email) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все обязательные поля',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://functions.poehali.dev/492be38a-a67b-4ad3-bcbd-5ba034d8af58', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          city: '',
          serviceType: `Программа: ${selectedProgramCalc}`,
          message: `Сумма: ${calcAmount[0].toLocaleString('ru')} ₽, Срок: ${calcTerm[0]} лет. ${formData.comment}`,
          source: 'calculator'
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Заявка отправлена!',
          description: `${formData.name}, мы свяжемся с вами в ближайшее время`,
          className: 'bg-green-50 border-green-200'
        });
        setShowApplicationForm(false);
        setFormData({ name: '', phone: '', email: '', comment: '' });
      } else {
        throw new Error(result.error || 'Ошибка отправки');
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку. Позвоните нам: +7 978 128-18-50',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader className="border-b">
        <CardTitle className="text-3xl">Ипотечный калькулятор</CardTitle>
        <CardDescription className="text-base">Рассчитайте ваш ежемесячный платёж по ипотеке</CardDescription>
      </CardHeader>
      <CardContent className="p-6 sm:p-8 space-y-8">
        <div className="space-y-2">
          <Label htmlFor="program" className="text-base font-semibold">Программа ипотеки</Label>
          <select
            id="program"
            value={selectedProgramCalc}
            onChange={(e) => setSelectedProgramCalc(e.target.value)}
            className="w-full p-4 border-2 rounded-xl bg-white text-lg font-medium hover:border-primary focus:border-primary transition-colors"
          >
            {programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name} — {program.rate}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Стоимость недвижимости</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={calcAmount[0]}
                  onChange={(e) => setCalcAmount([Number(e.target.value)])}
                  className="w-40 text-right text-lg font-bold border-2"
                />
                <span className="text-lg font-medium text-gray-600">₽</span>
              </div>
            </div>
            <Slider
              value={calcAmount}
              onValueChange={setCalcAmount}
              min={1000000}
              max={15000000}
              step={100000}
              className="py-2"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>1 млн ₽</span>
              <span>15 млн ₽</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Первоначальный взнос</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={calc.downPayment}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    const percent = Math.round((value / calcAmount[0]) * 100);
                    setCalcDownPayment([Math.min(Math.max(percent, 10), 90)]);
                  }}
                  className="w-40 text-right text-lg font-bold border-2"
                />
                <span className="text-lg font-medium text-gray-600">₽</span>
              </div>
            </div>
            <Slider
              value={calcDownPayment}
              onValueChange={setCalcDownPayment}
              min={10}
              max={90}
              step={5}
              className="py-2"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>10% ({Math.round(calcAmount[0] * 0.1).toLocaleString('ru-RU')} ₽)</span>
              <span className="text-center font-medium text-primary text-base">{calcDownPayment[0]}%</span>
              <span>90% ({Math.round(calcAmount[0] * 0.9).toLocaleString('ru-RU')} ₽)</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-base font-semibold">Срок кредита</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={calcTerm[0]}
                  onChange={(e) => setCalcTerm([Number(e.target.value)])}
                  className="w-24 text-right text-lg font-bold border-2"
                  min={1}
                  max={30}
                />
                <span className="text-lg font-medium text-gray-600">лет</span>
              </div>
            </div>
            <Slider
              value={calcTerm}
              onValueChange={setCalcTerm}
              min={1}
              max={30}
              step={1}
              className="py-2"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>1 год</span>
              <span>30 лет</span>
            </div>
          </div>
        </div>

        <div className="border-t-2 pt-8 mt-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-2 text-lg">Ежемесячный платёж</p>
              <p className="text-5xl sm:text-6xl font-bold text-primary mb-1">{calc.monthly.toLocaleString('ru-RU')} ₽</p>
              <p className="text-sm text-gray-500">на {calcTerm[0]} {calcTerm[0] === 1 ? 'год' : calcTerm[0] < 5 ? 'года' : 'лет'}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Сумма кредита</p>
                <p className="text-2xl font-bold text-gray-900">{calc.loanAmount.toLocaleString('ru-RU')} ₽</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Первый взнос</p>
                <p className="text-2xl font-bold text-gray-900">{calc.downPayment.toLocaleString('ru-RU')} ₽</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                <p className="text-sm text-gray-600 mb-1">Переплата</p>
                <p className="text-2xl font-bold text-orange-600">{(calc.total - calc.loanAmount).toLocaleString('ru-RU')} ₽</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Процентная ставка</span>
                <span className="text-xl font-bold text-primary">{programs.find(p => p.id === selectedProgramCalc)?.rate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Общая сумма выплат</span>
                <span className="text-xl font-bold text-gray-900">{calc.total.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>

            <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                  <Icon name="Send" className="mr-2" />
                  Отправить заявку на ипотеку
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Заявка на ипотеку</DialogTitle>
                  <DialogDescription>
                    {programs.find(p => p.id === selectedProgramCalc)?.name} • {calc.monthly.toLocaleString('ru-RU')} ₽/мес
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ваше имя *</Label>
                    <Input
                      id="name"
                      placeholder="Иван Иванов"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+7 900 123-45-67"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ivan@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comment">Комментарий</Label>
                    <Textarea
                      id="comment"
                      placeholder="Дополнительная информация..."
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                    <p className="font-semibold">Параметры заявки:</p>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Программа:</span>
                      <span className="font-medium">{programs.find(p => p.id === selectedProgramCalc)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Стоимость жилья:</span>
                      <span className="font-medium">{calcAmount[0].toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ежемесячный платёж:</span>
                      <span className="font-medium text-primary">{calc.monthly.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleSubmitApplication}
                    disabled={isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? (
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
                  <p className="text-xs text-center text-gray-500">
                    Нажимая кнопку, вы соглашаетесь на обработку персональных данных
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
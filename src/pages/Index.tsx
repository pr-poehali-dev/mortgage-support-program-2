import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

const programs = [
  {
    id: 'family',
    name: 'Семейная ипотека',
    rate: '6%',
    maxAmount: '12 млн ₽',
    maxAmountRegions: '6 млн ₽',
    downPayment: 'от 20%',
    term: 'до 30 лет',
    icon: 'Users',
    color: 'bg-blue-500',
    description: 'Для семей с детьми',
    details: 'Программа продлена до конца 2030 года. Максимальная сумма 12 млн рублей в Москве, МО, СПб и ЛО, 6 млн рублей в других регионах.',
    eligibility: ['Наличие детей', 'Гражданство РФ', 'Первоначальный взнос от 20%']
  },
  {
    id: 'it',
    name: 'IT-ипотека',
    rate: '6%',
    maxAmount: '9 млн ₽',
    downPayment: 'от 20%',
    term: 'до 30 лет',
    icon: 'Laptop',
    color: 'bg-purple-500',
    description: 'Для IT-специалистов',
    details: 'Для специалистов из аккредитованных IT-компаний. Работает во всех регионах, кроме Москвы и Санкт-Петербурга.',
    eligibility: ['Работа в аккредитованной IT-компании', 'Подтверждение занятости', 'Гражданство РФ']
  },
  {
    id: 'military',
    name: 'Военная ипотека',
    rate: 'По НИС',
    maxAmount: '1,58 млн ₽',
    downPayment: 'от 20,1%',
    term: 'до 25 лет',
    icon: 'Shield',
    color: 'bg-green-500',
    description: 'Для военнослужащих',
    details: 'Максимальная сумма 1,58 млн рублей при взносе от 30,1%. Участники боевых действий могут оформить целевой заём сразу после включения в НИС.',
    eligibility: ['Участие в НИС', 'Военнослужащий по контракту', 'Стаж в НИС от 3 лет']
  },
  {
    id: 'rural',
    name: 'Сельская ипотека',
    rate: 'до 3%',
    rateSpecial: '0,1% на приграничных территориях',
    maxAmount: '6 млн ₽',
    downPayment: 'от 20%',
    term: 'до 25 лет',
    icon: 'Home',
    color: 'bg-emerald-500',
    description: 'Для жителей сельских районов',
    details: 'Для покупки жилья в населённых пунктах с населением не более 30 тыс. человек. Ставка 0,1% на приграничных территориях.',
    eligibility: ['Приобретение жилья в селе до 30 тыс. человек', 'Гражданство РФ', 'Первоначальный взнос от 20%']
  }
];

const faqItems = [
  {
    question: 'Можно ли совместить несколько программ?',
    answer: 'Нет, одновременно можно использовать только одну федеральную программу льготной ипотеки.'
  },
  {
    question: 'Какие документы нужны для оформления?',
    answer: 'Паспорт, справка о доходах (2-НДФЛ или по форме банка), трудовая книжка или договор, документы на приобретаемое жильё, свидетельства о рождении детей (для семейной ипотеки).'
  },
  {
    question: 'Сколько времени занимает оформление?',
    answer: 'Рассмотрение заявки обычно занимает 2-5 рабочих дней. Полное оформление сделки — от 2 недель до 2 месяцев в зависимости от программы и банка.'
  },
  {
    question: 'Можно ли досрочно погасить ипотеку?',
    answer: 'Да, все программы предусматривают возможность досрочного погашения без штрафов и комиссий.'
  }
];

const blogArticles = [
  {
    id: 1,
    title: 'Как правильно выбрать программу ипотеки в 2025 году',
    excerpt: 'Разбираем ключевые критерии выбора льготной ипотеки: от семейного положения до региона покупки недвижимости.',
    category: 'Советы',
    icon: 'Lightbulb',
    color: 'bg-yellow-500',
    date: '15 декабря 2024',
    readTime: '5 мин',
    content: `
      <h3>Основные факторы выбора</h3>
      <p>При выборе ипотечной программы важно учитывать несколько ключевых факторов:</p>
      <ul>
        <li><strong>Семейное положение:</strong> Наличие детей открывает доступ к семейной ипотеке со ставкой 6%</li>
        <li><strong>Профессия:</strong> IT-специалисты и военнослужащие имеют доступ к специальным программам</li>
        <li><strong>Регион покупки:</strong> В крупных городах и сельской местности условия различаются</li>
        <li><strong>Размер первоначального взноса:</strong> Минимум 20% от стоимости жилья</li>
      </ul>
      <h3>Рекомендации эксперта</h3>
      <p>Не торопитесь с выбором. Проконсультируйтесь со специалистом, чтобы подобрать оптимальную программу под вашу ситуацию. Учитывайте не только процентную ставку, но и максимальную сумму кредита, срок и дополнительные условия.</p>
    `
  },
  {
    id: 2,
    title: 'Досрочное погашение ипотеки: стратегии и советы',
    excerpt: 'Узнайте, как эффективно досрочно погасить ипотеку и сэкономить на процентах. Два способа погашения и их преимущества.',
    category: 'Финансы',
    icon: 'TrendingDown',
    color: 'bg-green-500',
    date: '10 декабря 2024',
    readTime: '7 мин',
    content: `
      <h3>Два способа досрочного погашения</h3>
      <p>Существует два основных способа досрочного погашения ипотеки:</p>
      <ol>
        <li><strong>Уменьшение срока кредита:</strong> Ежемесячный платёж остаётся прежним, но срок выплаты сокращается. Экономия на процентах максимальна.</li>
        <li><strong>Уменьшение платежа:</strong> Срок остаётся прежним, но ежемесячный платёж снижается. Подходит для снижения финансовой нагрузки.</li>
      </ol>
      <h3>Когда выгоднее досрочно погашать</h3>
      <p>Наиболее выгодно вносить досрочные платежи в первой половине срока кредита, когда основная часть платежа идёт на погашение процентов. В льготных программах 2025 года нет штрафов за досрочное погашение.</p>
      <h3>Практический совет</h3>
      <p>Создайте график досрочных платежей. Даже небольшие дополнительные взносы 1-2 раза в год могут сократить срок ипотеки на несколько лет.</p>
    `
  },
  {
    id: 3,
    title: 'Топ-5 ошибок при оформлении ипотеки',
    excerpt: 'Изучите типичные ошибки заёмщиков и узнайте, как их избежать при оформлении ипотечного кредита.',
    category: 'Советы',
    icon: 'AlertTriangle',
    color: 'bg-red-500',
    date: '5 декабря 2024',
    readTime: '6 мин',
    content: `
      <h3>Ошибка №1: Неправильная оценка своих возможностей</h3>
      <p>Многие заёмщики берут максимальную сумму, которую одобряет банк, не учитывая свои реальные доходы и расходы. Правило: ежемесячный платёж не должен превышать 40% дохода семьи.</p>
      <h3>Ошибка №2: Игнорирование скрытых расходов</h3>
      <p>Помимо ежемесячного платежа учитывайте: страхование, оценку недвижимости, госпошлину, услуги риелтора. Это может составить 3-5% от стоимости жилья.</p>
      <h3>Ошибка №3: Выбор первого предложения</h3>
      <p>Сравните условия в 3-5 банках. Разница в ставке даже 0,5% может сэкономить сотни тысяч рублей.</p>
      <h3>Ошибка №4: Недооценка важности первоначального взноса</h3>
      <p>Чем больше первый взнос, тем меньше переплата по кредиту. Стремитесь к 30-40% вместо минимальных 20%.</p>
      <h3>Ошибка №5: Пренебрежение чтением договора</h3>
      <p>Внимательно изучите все пункты договора. Обратите внимание на условия изменения процентной ставки, штрафы и комиссии.</p>
    `
  },
  {
    id: 4,
    title: 'Семейная ипотека 2025: что изменилось',
    excerpt: 'Обзор последних изменений в программе семейной ипотеки. Новые лимиты, условия и перспективы до 2030 года.',
    category: 'Программы',
    icon: 'Users',
    color: 'bg-blue-500',
    date: '1 декабря 2024',
    readTime: '4 мин',
    content: `
      <h3>Продление программы до 2030 года</h3>
      <p>Правительство РФ продлило программу семейной ипотеки до конца 2030 года с сохранением льготной ставки 6%.</p>
      <h3>Актуальные условия</h3>
      <ul>
        <li><strong>Ставка:</strong> 6% годовых на весь срок кредита</li>
        <li><strong>Максимальная сумма:</strong> 12 млн ₽ в Москве, МО, СПб, ЛО; 6 млн ₽ в регионах</li>
        <li><strong>Срок:</strong> до 30 лет</li>
        <li><strong>Первый взнос:</strong> от 20%</li>
      </ul>
      <h3>Кто может участвовать</h3>
      <p>Программа доступна семьям с детьми, рождёнными с 2018 года. Также можно использовать материнский капитал как часть первоначального взноса.</p>
      <h3>Важные нюансы</h3>
      <p>Программа распространяется как на новостройки, так и на вторичное жильё (при определённых условиях). Проконсультируйтесь со специалистом для уточнения деталей.</p>
    `
  },
  {
    id: 5,
    title: 'IT-ипотека: гид для специалистов',
    excerpt: 'Подробное руководство по IT-ипотеке для специалистов технологической отрасли. Требования, документы, лайфхаки.',
    category: 'Программы',
    icon: 'Laptop',
    color: 'bg-purple-500',
    date: '25 ноября 2024',
    readTime: '8 мин',
    content: `
      <h3>Кто может получить IT-ипотеку</h3>
      <p>Программа доступна специалистам, работающим в аккредитованных IT-компаниях. Ваша компания должна быть включена в специальный реестр Минцифры РФ.</p>
      <h3>Условия программы</h3>
      <ul>
        <li><strong>Ставка:</strong> 6% годовых</li>
        <li><strong>Максимальная сумма:</strong> 9 млн рублей</li>
        <li><strong>Регионы:</strong> вся Россия кроме Москвы и Санкт-Петербурга</li>
        <li><strong>Срок:</strong> до 30 лет</li>
      </ul>
      <h3>Необходимые документы</h3>
      <p>Стандартный пакет документов + справка от работодателя о занятости в аккредитованной IT-компании. Стаж работы в IT-сфере должен быть не менее 3 месяцев.</p>
      <h3>Лайфхак для IT-специалистов</h3>
      <p>Если вы работаете удалённо из Москвы или СПб, но ваша компания зарегистрирована в регионе, вы можете претендовать на IT-ипотеку. Уточните возможность покупки жилья в вашем регионе.</p>
    `
  },
  {
    id: 6,
    title: 'Рефинансирование ипотеки: когда это выгодно',
    excerpt: 'Разбираемся, в каких случаях стоит рефинансировать действующую ипотеку и как это правильно сделать в 2025 году.',
    category: 'Финансы',
    icon: 'RefreshCw',
    color: 'bg-indigo-500',
    date: '20 ноября 2024',
    readTime: '6 мин',
    content: `
      <h3>Что такое рефинансирование</h3>
      <p>Рефинансирование — это оформление нового кредита для погашения действующей ипотеки. Цель: получить более выгодные условия (ставку, срок, размер платежа).</p>
      <h3>Когда рефинансирование выгодно</h3>
      <ul>
        <li>Разница в ставках составляет минимум 2%</li>
        <li>До окончания выплат осталось более 5 лет</li>
        <li>Вы выплатили менее 50% суммы кредита</li>
        <li>Ваша кредитная история улучшилась</li>
      </ul>
      <h3>Особенности в 2025 году</h3>
      <p>С появлением льготных программ многие заёмщики с рыночными ставками 10-15% могут перейти на 6%. Экономия может достигать миллионов рублей.</p>
      <h3>Процесс рефинансирования</h3>
      <ol>
        <li>Оцените текущие условия и рассчитайте потенциальную выгоду</li>
        <li>Подберите банк с подходящим предложением</li>
        <li>Подготовьте документы (паспорт, справка 2-НДФЛ, договор ипотеки)</li>
        <li>Дождитесь одобрения (3-7 дней)</li>
        <li>Оформите новый кредит и погасите старый</li>
      </ol>
    `
  }
];

export default function Index() {
  const [activeTab, setActiveTab] = useState('programs');
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [recommendedProgram, setRecommendedProgram] = useState<string | null>(null);
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
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [blogCategory, setBlogCategory] = useState('all');

  const quizQuestions = [
    {
      id: 'category',
      question: 'К какой категории вы относитесь?',
      options: [
        { value: 'family', label: 'У меня есть дети', icon: 'Users' },
        { value: 'it', label: 'Я IT-специалист', icon: 'Laptop' },
        { value: 'military', label: 'Я военнослужащий', icon: 'Shield' },
        { value: 'rural', label: 'Хочу купить жильё в селе', icon: 'Home' }
      ]
    },
    {
      id: 'region',
      question: 'В каком регионе планируете покупку?',
      options: [
        { value: 'moscow', label: 'Москва или МО', icon: 'Building' },
        { value: 'spb', label: 'Санкт-Петербург или ЛО', icon: 'Building' },
        { value: 'other', label: 'Другой регион', icon: 'MapPin' }
      ]
    },
    {
      id: 'amount',
      question: 'Какая сумма кредита вам нужна?',
      options: [
        { value: 'low', label: 'До 3 млн ₽', icon: 'CircleDollarSign' },
        { value: 'medium', label: '3-6 млн ₽', icon: 'CircleDollarSign' },
        { value: 'high', label: '6-12 млн ₽', icon: 'CircleDollarSign' }
      ]
    }
  ];

  const handleQuizAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...quizAnswers, [questionId]: value };
    setQuizAnswers(newAnswers);
    
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      const category = newAnswers.category;
      const region = newAnswers.region;
      
      if (category === 'it' && (region === 'moscow' || region === 'spb')) {
        setRecommendedProgram('family');
      } else {
        setRecommendedProgram(category);
      }
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
    setRecommendedProgram(null);
  };

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
      const response = await fetch('https://functions.poehali.dev/2ea2118e-5b11-45d1-8e9d-bd90ba41a588', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          program: selectedProgramCalc,
          amount: calcAmount[0],
          comment: formData.comment
        })
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: 'Заявка отправлена!',
          description: result.message,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Home" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ипотека РФ 2025</h1>
                <p className="text-sm text-gray-600">Льготные программы с господдержкой</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <a href="tel:+79781281850" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                <Icon name="Phone" size={20} />
                <span className="font-semibold hidden md:inline">+7 978 128-18-50</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-12 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Найдите свою ипотеку за 3 вопроса
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Подберём оптимальную программу на основе вашей ситуации
          </p>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="text-lg px-8 py-6 hover:scale-105 transition-transform">
                <Icon name="MessageSquare" className="mr-2" />
                Пройти опрос — подобрать программу
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">Подбор ипотечной программы</DialogTitle>
                <DialogDescription>
                  Ответьте на несколько вопросов для персональной рекомендации
                </DialogDescription>
              </DialogHeader>
              
              {!recommendedProgram ? (
                <div className="space-y-6 py-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">Вопрос {quizStep + 1} из {quizQuestions.length}</span>
                    <div className="flex gap-1">
                      {quizQuestions.map((_, idx) => (
                        <div
                          key={idx}
                          className={`h-2 w-8 rounded-full transition-colors ${
                            idx === quizStep ? 'bg-primary' : idx < quizStep ? 'bg-primary/50' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-4">{quizQuestions[quizStep].question}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quizQuestions[quizStep].options.map((option) => (
                      <Card
                        key={option.value}
                        className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-primary"
                        onClick={() => handleQuizAnswer(quizQuestions[quizStep].id, option.value)}
                      >
                        <CardContent className="flex items-center gap-4 p-6">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon name={option.icon} className="text-primary" size={24} />
                          </div>
                          <span className="font-medium">{option.label}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {quizStep > 0 && (
                    <Button variant="outline" onClick={() => setQuizStep(quizStep - 1)}>
                      <Icon name="ArrowLeft" className="mr-2" size={16} />
                      Назад
                    </Button>
                  )}
                </div>
              ) : (
                <div className="py-4 space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="CheckCircle" className="text-green-600" size={40} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Подобрана программа!</h3>
                    <p className="text-gray-600">На основе ваших ответов рекомендуем:</p>
                  </div>
                  
                  {programs.filter(p => p.id === recommendedProgram).map((program) => (
                    <Card key={program.id} className="border-2 border-primary">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-2xl">{program.name}</CardTitle>
                            <CardDescription className="text-base mt-2">{program.description}</CardDescription>
                          </div>
                          <div className={`w-14 h-14 ${program.color} rounded-lg flex items-center justify-center`}>
                            <Icon name={program.icon} className="text-white" size={28} />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Ставка</p>
                            <p className="text-xl font-bold text-primary">{program.rate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Сумма</p>
                            <p className="text-xl font-bold">{program.maxAmount}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Взнос</p>
                            <p className="text-xl font-bold">{program.downPayment}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Срок</p>
                            <p className="text-xl font-bold">{program.term}</p>
                          </div>
                        </div>
                        <p className="text-gray-700">{program.details}</p>
                      </CardContent>
                    </Card>
                  ))}
                  
                  <div className="flex gap-4">
                    <Button onClick={resetQuiz} variant="outline" className="flex-1">
                      Пройти опрос заново
                    </Button>
                    <Button onClick={() => setActiveTab('calculator')} className="flex-1">
                      <Icon name="Calculator" className="mr-2" size={16} />
                      Рассчитать платёж
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 h-auto gap-2 bg-white p-2 rounded-xl shadow-sm">
            <TabsTrigger value="programs" className="flex items-center gap-2 py-3">
              <Icon name="Home" size={18} />
              <span className="hidden sm:inline">Программы</span>
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2 py-3">
              <Icon name="GitCompare" size={18} />
              <span className="hidden sm:inline">Сравнение</span>
            </TabsTrigger>
            <TabsTrigger value="calculator" className="flex items-center gap-2 py-3">
              <Icon name="Calculator" size={18} />
              <span className="hidden sm:inline">Калькулятор</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2 py-3">
              <Icon name="HelpCircle" size={18} />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2 py-3">
              <Icon name="BookOpen" size={18} />
              <span className="hidden sm:inline">Блог</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2 py-3">
              <Icon name="Phone" size={18} />
              <span className="hidden sm:inline">Контакты</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="programs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programs.map((program) => (
                <Card key={program.id} className="hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{program.name}</CardTitle>
                        <CardDescription className="text-base mt-2">{program.description}</CardDescription>
                      </div>
                      <div className={`w-14 h-14 ${program.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon name={program.icon} className="text-white" size={28} />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Ставка</p>
                        <p className="text-2xl font-bold text-primary">{program.rate}</p>
                        {program.rateSpecial && (
                          <p className="text-xs text-green-600 mt-1">{program.rateSpecial}</p>
                        )}
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Макс. сумма</p>
                        <p className="text-2xl font-bold text-secondary">{program.maxAmount}</p>
                        {program.maxAmountRegions && (
                          <p className="text-xs text-gray-600 mt-1">{program.maxAmountRegions}</p>
                        )}
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Первый взнос</p>
                        <p className="text-xl font-bold">{program.downPayment}</p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Срок</p>
                        <p className="text-xl font-bold">{program.term}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-800">Условия участия:</p>
                      <ul className="space-y-1">
                        {program.eligibility.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <Icon name="CheckCircle2" className="text-green-600 flex-shrink-0 mt-0.5" size={16} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <p className="text-sm text-gray-600 border-t pt-4">{program.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Сравнение программ</CardTitle>
                <CardDescription>Основные параметры всех доступных программ</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold">Программа</th>
                        <th className="text-center p-4 font-semibold">Ставка</th>
                        <th className="text-center p-4 font-semibold">Макс. сумма</th>
                        <th className="text-center p-4 font-semibold">Первый взнос</th>
                        <th className="text-center p-4 font-semibold">Срок</th>
                      </tr>
                    </thead>
                    <tbody>
                      {programs.map((program) => (
                        <tr key={program.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 ${program.color} rounded-lg flex items-center justify-center`}>
                                <Icon name={program.icon} className="text-white" size={20} />
                              </div>
                              <div>
                                <p className="font-semibold">{program.name}</p>
                                <p className="text-sm text-gray-600">{program.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="secondary" className="text-base">{program.rate}</Badge>
                          </td>
                          <td className="p-4 text-center font-semibold">{program.maxAmount}</td>
                          <td className="p-4 text-center font-semibold">{program.downPayment}</td>
                          <td className="p-4 text-center font-semibold">{program.term}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Калькулятор ипотеки</CardTitle>
                  <CardDescription>Рассчитайте ежемесячный платёж</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="program">Программа</Label>
                    <select
                      id="program"
                      value={selectedProgramCalc}
                      onChange={(e) => setSelectedProgramCalc(e.target.value)}
                      className="w-full p-3 border rounded-lg bg-white"
                    >
                      {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.name} ({program.rate})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Стоимость жилья: {calcAmount[0].toLocaleString('ru-RU')} ₽</Label>
                    <Slider
                      value={calcAmount}
                      onValueChange={setCalcAmount}
                      min={1000000}
                      max={15000000}
                      step={100000}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1 млн ₽</span>
                      <span>15 млн ₽</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Первоначальный взнос: {calcDownPayment[0]}%</Label>
                    <Slider
                      value={calcDownPayment}
                      onValueChange={setCalcDownPayment}
                      min={10}
                      max={50}
                      step={5}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>10%</span>
                      <span>50%</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Срок кредита: {calcTerm[0]} лет</Label>
                    <Slider
                      value={calcTerm}
                      onValueChange={setCalcTerm}
                      min={5}
                      max={30}
                      step={1}
                      className="py-4"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>5 лет</span>
                      <span>30 лет</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Результат расчёта</CardTitle>
                  <CardDescription className="text-blue-100">
                    {programs.find(p => p.id === selectedProgramCalc)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                    <p className="text-blue-100 mb-2">Ежемесячный платёж</p>
                    <p className="text-5xl font-bold">{calc.monthly.toLocaleString('ru-RU')} ₽</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-blue-100 text-sm mb-1">Сумма кредита</p>
                      <p className="text-2xl font-bold">{calc.loanAmount.toLocaleString('ru-RU')} ₽</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <p className="text-blue-100 text-sm mb-1">Первый взнос</p>
                      <p className="text-2xl font-bold">{calc.downPayment.toLocaleString('ru-RU')} ₽</p>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-blue-100 text-sm mb-1">Переплата за {calcTerm[0]} лет</p>
                    <p className="text-2xl font-bold">
                      {(calc.total - calc.loanAmount).toLocaleString('ru-RU')} ₽
                    </p>
                  </div>

                  <Dialog open={showApplicationForm} onOpenChange={setShowApplicationForm}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" className="w-full" size="lg">
                        <Icon name="Send" className="mr-2" />
                        Отправить заявку
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
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Часто задаваемые вопросы</CardTitle>
                <CardDescription>Ответы на популярные вопросы об ипотеке</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left text-lg font-semibold">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700 text-base leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold">Блог об ипотеке</h2>
                <p className="text-gray-600 mt-2">Полезные статьи и советы от экспертов</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={blogCategory === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBlogCategory('all')}
                >
                  Все
                </Button>
                <Button
                  variant={blogCategory === 'Советы' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBlogCategory('Советы')}
                >
                  Советы
                </Button>
                <Button
                  variant={blogCategory === 'Финансы' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBlogCategory('Финансы')}
                >
                  Финансы
                </Button>
                <Button
                  variant={blogCategory === 'Программы' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setBlogCategory('Программы')}
                >
                  Программы
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogArticles
                .filter(article => blogCategory === 'all' || article.category === blogCategory)
                .map((article) => (
                <Card key={article.id} className="hover:shadow-xl transition-all cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary">{article.category}</Badge>
                      <div className={`w-12 h-12 ${article.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon name={article.icon} className="text-white" size={24} />
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">{article.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{article.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <Icon name="Calendar" size={14} />
                        <span>{article.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" size={14} />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setSelectedArticle(article.id)}
                        >
                          Читать полностью
                          <Icon name="ArrowRight" className="ml-2" size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-14 h-14 ${article.color} rounded-lg flex items-center justify-center`}>
                              <Icon name={article.icon} className="text-white" size={28} />
                            </div>
                            <div>
                              <Badge variant="secondary" className="mb-2">{article.category}</Badge>
                              <DialogTitle className="text-2xl">{article.title}</DialogTitle>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                              <Icon name="Calendar" size={14} />
                              <span>{article.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Icon name="Clock" size={14} />
                              <span>{article.readTime}</span>
                            </div>
                          </div>
                        </DialogHeader>
                        <div
                          className="prose prose-lg max-w-none mt-6"
                          dangerouslySetInnerHTML={{ __html: article.content }}
                          style={{
                            color: '#374151',
                            lineHeight: '1.75'
                          }}
                        />
                        <div className="border-t pt-6 mt-6">
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-lg">
                            <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                              <Icon name="Phone" className="text-primary" size={20} />
                              Нужна консультация?
                            </h4>
                            <p className="text-gray-700 mb-4">Свяжитесь с нашим экспертом для получения персональной консультации</p>
                            <div className="flex gap-3">
                              <Button asChild>
                                <a href="tel:+79781281850">
                                  <Icon name="Phone" className="mr-2" size={16} />
                                  Позвонить
                                </a>
                              </Button>
                              <Button variant="outline" asChild>
                                <a href="mailto:ipoteka_krym@mail.ru">
                                  <Icon name="Mail" className="mr-2" size={16} />
                                  Написать
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Свяжитесь с нами</CardTitle>
                  <CardDescription>Получите бесплатную консультацию по ипотеке</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                      <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                        <Icon name="User" className="text-white" size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Николаев Дмитрий Юрьевич</p>
                        <p className="text-sm text-gray-600">Специалист по ипотеке</p>
                      </div>
                    </div>

                    <a
                      href="tel:+79781281850"
                      className="flex items-center gap-4 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon name="Phone" className="text-white" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Телефон</p>
                        <p className="font-semibold text-xl text-gray-900">+7 978 128-18-50</p>
                      </div>
                    </a>

                    <a
                      href="mailto:ipoteka_krym@mail.ru"
                      className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon name="Mail" className="text-white" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-semibold text-gray-900">ipoteka_krym@mail.ru</p>
                      </div>
                    </a>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-semibold mb-3">Наши услуги:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Icon name="CheckCircle2" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                        <span>Подбор оптимальной ипотечной программы</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="CheckCircle2" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                        <span>Помощь в сборе и оформлении документов</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="CheckCircle2" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                        <span>Полное сопровождение сделки</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Icon name="CheckCircle2" className="text-green-600 flex-shrink-0 mt-1" size={18} />
                        <span>Консультации по всем вопросам ипотеки</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                <CardHeader>
                  <CardTitle className="text-2xl text-white">Преимущества работы с нами</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="BadgeCheck" className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Экспертность</h4>
                      <p className="text-blue-100">Глубокие знания всех ипотечных программ и актуальных условий</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Clock" className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Экономия времени</h4>
                      <p className="text-blue-100">Берём на себя всю рутинную работу с документами и банками</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="Shield" className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Надёжность</h4>
                      <p className="text-blue-100">Гарантируем юридическую чистоту сделки</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="TrendingDown" className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Лучшие условия</h4>
                      <p className="text-blue-100">Помогаем получить максимально выгодные условия кредитования</p>
                    </div>
                  </div>

                  <div className="border-t border-white/20 pt-6 mt-6">
                    <Button variant="secondary" className="w-full" size="lg">
                      <Icon name="MessageCircle" className="mr-2" />
                      Получить консультацию
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Home" className="text-white" size={24} />
              </div>
              <div>
                <p className="font-bold">Ипотека РФ 2025</p>
                <p className="text-sm text-gray-400">Льготные программы с господдержкой</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="font-semibold">Николаев Дмитрий Юрьевич</p>
              <p className="text-gray-400">+7 978 128-18-50</p>
              <p className="text-gray-400">ipoteka_krym@mail.ru</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-sm">
            <p>© 2025 Все права защищены. Информация носит справочный характер.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
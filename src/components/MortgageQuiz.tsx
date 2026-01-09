import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { programs } from '@/data/mortgageData';
import { trackQuizCompleted } from '@/services/analytics';

interface MortgageQuizProps {
  onNavigateToCalculator: () => void;
}

export default function MortgageQuiz({ onNavigateToCalculator }: MortgageQuizProps) {
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [recommendedProgram, setRecommendedProgram] = useState<string | null>(null);

  const quizQuestions = [
    {
      id: 'category',
      question: 'К какой категории вы относитесь?',
      options: [
        { value: 'family', label: 'У меня есть дети', icon: 'Users' },
        { value: 'it', label: 'Я IT-специалист', icon: 'Laptop' },
        { value: 'military', label: 'Я военнослужащий', icon: 'Shield' },
        { value: 'rural', label: 'Хочу купить жильё в селе', icon: 'Home' },
        { value: 'basic', label: 'Не подхожу под льготы', icon: 'Building2' }
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

  const handleQuizAnswer = async (questionId: string, value: string) => {
    const newAnswers = { ...quizAnswers, [questionId]: value };
    setQuizAnswers(newAnswers);
    
    if (quizStep < quizQuestions.length - 1) {
      setQuizStep(quizStep + 1);
    } else {
      const category = newAnswers.category;
      const region = newAnswers.region;
      const amount = newAnswers.amount;
      
      let result = category;
      if (category === 'it' && (region === 'moscow' || region === 'spb')) {
        result = 'family';
        setRecommendedProgram('family');
      } else {
        setRecommendedProgram(category);
      }
      trackQuizCompleted(result);
      
      try {
        await fetch('https://functions.poehali.dev/a629770f-6198-42f3-b832-972cdcbcdf61', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category,
            region,
            loanAmountRange: amount,
            recommendedProgram: programs.find(p => p.id === result)?.title || result,
            sessionId: `quiz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          })
        });
      } catch (error) {
        console.error('Failed to save quiz result:', error);
      }
    }
  };

  const resetQuiz = () => {
    setQuizStep(0);
    setQuizAnswers({});
    setRecommendedProgram(null);
  };

  return (
    <section className="mb-4 sm:mb-8 text-center">
      <h2 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent px-2">
        Найдите свою ипотеку за 3 вопроса
      </h2>
      <p className="text-sm sm:text-lg text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto px-4">
        Подберём оптимальную программу на основе вашей ситуации
      </p>
      
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" className="text-xs sm:text-base px-3 sm:px-6 py-3 sm:py-5 hover:scale-105 transition-transform w-full sm:w-auto max-w-md mx-auto">
            <Icon name="MessageSquare" className="mr-1.5 sm:mr-2" size={16} />
            <span className="hidden sm:inline">Пройти опрос — подобрать программу</span>
            <span className="sm:hidden">Подобрать программу</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {quizQuestions[quizStep].options.map((option) => (
                  <Card
                    key={option.value}
                    className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 hover:border-primary"
                    onClick={() => handleQuizAnswer(quizQuestions[quizStep].id, option.value)}
                  >
                    <CardContent className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon name={option.icon} className="text-primary" size={20} />
                      </div>
                      <span className="font-medium text-sm sm:text-base">{option.label}</span>
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
                <Button onClick={onNavigateToCalculator} className="flex-1">
                  <Icon name="Calculator" className="mr-2" size={16} />
                  Рассчитать платёж
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
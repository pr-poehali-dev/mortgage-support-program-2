import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShareButton from '@/components/ShareButton';
import { useDailyTheme } from '@/hooks/useDailyTheme';
import ServiceCalculator from '@/components/ServiceCalculator';
import ServiceCard from '@/components/ServiceCard';
import ServiceDetailsDialog from '@/components/ServiceDetailsDialog';
import ServiceRequestForm from '@/components/ServiceRequestForm';
import { services, Service } from '@/data/servicesData';

export default function Services() {
  const navigate = useNavigate();
  const theme = useDailyTheme();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [requestFormOpen, setRequestFormOpen] = useState(false);
  const [requestServiceName, setRequestServiceName] = useState('');

  return (
    <div className={`min-h-screen ${theme.gradient}`}>
      <SEO 
        title="Услуги агентства недвижимости | МГСН"
        description="Полный спектр услуг в сфере недвижимости: покупка, продажа, аренда, ипотека, юридическое сопровождение сделок"
      />
      
      <header className={`border-b ${theme.headerBg} backdrop-blur-md sticky top-0 z-50`}>
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <Icon name="ArrowLeft" size={20} />
              <span className="hidden sm:inline">На главную</span>
            </Button>
            <h1 className="text-lg sm:text-2xl font-bold">Наши услуги</h1>
            <ShareButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="max-w-6xl mx-auto">
          <Breadcrumbs />
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">
              Профессиональные услуги в сфере недвижимости
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              Мы предлагаем полный спектр услуг для решения любых задач, связанных с недвижимостью. 
              Наша команда экспертов обеспечит вам надежную поддержку на каждом этапе.
            </p>
          </div>

          <div className="mb-10 sm:mb-12">
            <ServiceCalculator />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onDetailsClick={setSelectedService}
                onRequestClick={(serviceName) => {
                  setRequestServiceName(serviceName);
                  setRequestFormOpen(true);
                }}
              />
            ))}
          </div>

          <div className="mt-10 sm:mt-16 bg-white/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-lg text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              Не нашли нужную услугу?
            </h3>
            <p className="text-base sm:text-lg text-gray-600 mb-5 sm:mb-6 max-w-2xl mx-auto">
              Свяжитесь с нами, и мы подберем индивидуальное решение для ваших задач
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
              >
                <Icon name="FileText" className="mr-2" size={20} />
                Оставить заявку
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  navigate('/');
                  setTimeout(() => {
                    const element = document.querySelector('[value="contact"]');
                    element?.click();
                  }, 100);
                }}
              >
                <Icon name="Phone" className="mr-2" size={20} />
                Контакты
              </Button>
            </div>
          </div>

          {/* Быстрые ссылки */}
          <div className="mt-10 sm:mt-12 bg-white/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Полезные разделы</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Icon name="Home" size={24} className="text-primary" />
                <span className="text-sm font-medium text-center">Главная</span>
              </button>
              <button
                onClick={() => navigate('/?tab=calculator')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Icon name="Calculator" size={24} className="text-primary" />
                <span className="text-sm font-medium text-center">Калькулятор</span>
              </button>
              <button
                onClick={() => navigate('/?tab=properties')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Icon name="Building" size={24} className="text-primary" />
                <span className="text-sm font-medium text-center">Недвижимость</span>
              </button>
              <button
                onClick={() => navigate('/?tab=contact')}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Icon name="Phone" size={24} className="text-primary" />
                <span className="text-sm font-medium text-center">Контакты</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/20 mt-10 sm:mt-16 py-6 sm:py-8">
        <div className="container mx-auto px-3 sm:px-4 text-center text-sm text-gray-600">
          <p>© 2024 МГСН - Агентство недвижимости. Все права защищены.</p>
        </div>
      </footer>

      <ServiceDetailsDialog
        service={selectedService}
        open={!!selectedService}
        onOpenChange={() => setSelectedService(null)}
        onRequestClick={() => {
          setRequestServiceName(selectedService?.title || '');
          setSelectedService(null);
          setRequestFormOpen(true);
        }}
      />

      <ServiceRequestForm
        isOpen={requestFormOpen}
        onClose={() => setRequestFormOpen(false)}
        serviceName={requestServiceName}
      />
    </div>
  );
}
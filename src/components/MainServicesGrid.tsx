import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

export default function MainServicesGrid() {
  const navigate = useNavigate();

  const mainServices = [
    {
      id: 'mortgage',
      title: 'Ипотека',
      icon: 'Percent',
      description: 'Подберем выгодные условия ипотеки и поможем получить одобрение банка',
      color: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100/50',
      borderColor: 'border-blue-200',
      onClick: () => {
        navigate('/');
        setTimeout(() => {
          const params = new URLSearchParams(window.location.search);
          params.set('tab', 'mortgage');
          window.history.pushState({}, '', `?${params.toString()}`);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }, 100);
      }
    },
    {
      id: 'sell-help',
      title: 'Помощь продать',
      icon: 'TrendingUp',
      description: 'Профессиональное сопровождение продажи недвижимости от оценки до сделки',
      color: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100/50',
      borderColor: 'border-green-200',
      onClick: () => navigate('/sell-help')
    },
    {
      id: 'services',
      title: 'Услуги',
      icon: 'Briefcase',
      description: 'Полный спектр услуг по работе с недвижимостью: от консультации до оформления',
      color: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100/50',
      borderColor: 'border-purple-200',
      onClick: () => navigate('/services')
    },
    {
      id: 'rent-help',
      title: 'Помощь сдать',
      icon: 'Key',
      description: 'Найдем надежных арендаторов и оформим все документы правильно',
      color: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100/50',
      borderColor: 'border-orange-200',
      onClick: () => navigate('/rent-help')
    }
  ];

  return (
    <section className="mb-8 sm:mb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {mainServices.map((service) => (
          <div
            key={service.id}
            onClick={service.onClick}
            className={`bg-gradient-to-br ${service.bgGradient} border-2 ${service.borderColor} rounded-xl p-6 hover:shadow-xl transition-all cursor-pointer group`}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`bg-gradient-to-br ${service.color} rounded-2xl p-4 mb-4 group-hover:scale-110 transition-transform`}>
                <Icon name={service.icon} size={32} className="text-white" />
              </div>
              
              <h3 className="font-bold text-xl mb-3 text-gray-900">
                {service.title}
              </h3>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                {service.description}
              </p>
              
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 group-hover:gap-3 transition-all">
                Подробнее
                <Icon name="ArrowRight" size={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

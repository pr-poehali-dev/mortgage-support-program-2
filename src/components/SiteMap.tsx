import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface SiteMapSection {
  title: string;
  icon: string;
  links: { label: string; path: string; onClick?: () => void }[];
}

export default function SiteMap() {
  const navigate = useNavigate();

  const sections: SiteMapSection[] = [
    {
      title: 'Ипотека',
      icon: 'Home',
      links: [
        { label: 'Ипотечные программы', path: '/?tab=programs', onClick: () => navigate('/?tab=programs') },
        { label: 'Калькулятор ипотеки', path: '/?tab=calculator', onClick: () => navigate('/?tab=calculator') },
        { label: 'Подать заявку на ипотеку', path: '/register', onClick: () => navigate('/register') },
        { label: 'Часто задаваемые вопросы', path: '/faq', onClick: () => navigate('/faq') }
      ]
    },
    {
      title: 'Недвижимость',
      icon: 'Building',
      links: [
        { label: 'Каталог недвижимости', path: '/catalog', onClick: () => navigate('/catalog') },
        { label: 'Квартиры в Севастополе', path: '/catalog', onClick: () => navigate('/catalog') },
        { label: 'Дома и участки', path: '/catalog', onClick: () => navigate('/catalog') },
        { label: 'Добавить объект', path: '/add-property', onClick: () => navigate('/add-property') }
      ]
    },
    {
      title: 'Услуги',
      icon: 'Briefcase',
      links: [
        { label: 'Все услуги', path: '/services', onClick: () => navigate('/services') },
        { label: 'Помощь в покупке', path: '/services', onClick: () => navigate('/services') },
        { label: 'Помощь в продаже', path: '/services', onClick: () => navigate('/services') },
        { label: 'Юридическое сопровождение', path: '/services', onClick: () => navigate('/services') }
      ]
    },
    {
      title: 'Информация',
      icon: 'Info',
      links: [
        { label: 'О компании', path: '/?tab=home', onClick: () => navigate('/?tab=home') },
        { label: 'Блог и статьи', path: '/blog', onClick: () => navigate('/blog') },
        { label: 'Видео', path: '/?tab=videos', onClick: () => navigate('/?tab=videos') },
        { label: 'Контакты', path: '/contact', onClick: () => navigate('/contact') }
      ]
    },
    {
      title: 'Правовая информация',
      icon: 'FileText',
      links: [
        { label: 'Политика конфиденциальности', path: '/privacy-policy', onClick: () => navigate('/privacy-policy') },
        { label: 'Условия использования', path: '/terms-of-service', onClick: () => navigate('/terms-of-service') }
      ]
    }
  ];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 sm:p-8 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 rounded-lg p-2">
          <Icon name="Map" size={24} className="text-primary" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Карта сайта</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="flex items-center gap-2 mb-3">
              <Icon name={section.icon} size={18} className="text-primary" />
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
            </div>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={link.onClick}
                    className="text-sm text-gray-600 hover:text-primary transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Не нашли что искали? Свяжитесь с нами напрямую
          </p>
          <Button
            onClick={() => navigate('/contact')}
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
          >
            <Icon name="Phone" className="mr-2" size={18} />
            Связаться с нами
          </Button>
        </div>
      </div>
    </div>
  );
}
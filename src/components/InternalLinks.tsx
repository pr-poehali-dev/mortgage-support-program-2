import { Link } from 'react-router-dom';
import Icon from '@/components/ui/icon';

interface InternalLink {
  title: string;
  url: string;
  icon: string;
  description: string;
}

const links: InternalLink[] = [
  {
    title: 'Наши услуги',
    url: '/services',
    icon: 'Briefcase',
    description: 'Полный спектр услуг в сфере недвижимости'
  },
  {
    title: 'Заявка на ипотеку',
    url: '/register',
    icon: 'FileText',
    description: 'Подберем лучшие условия кредитования'
  },
  {
    title: 'Объекты недвижимости',
    url: '/catalog',
    icon: 'Home',
    description: 'Каталог квартир, домов и земельных участков'
  },
  {
    title: 'Калькулятор ипотеки',
    url: '/?tab=calculator',
    icon: 'Calculator',
    description: 'Рассчитайте ежемесячный платеж онлайн'
  }
];

export default function InternalLinks() {
  return (
    <nav className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg" aria-label="Навигация по разделам сайта">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Полезные разделы</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link) => (
          <Link
            key={link.url}
            to={link.url}
            className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="bg-primary/10 rounded-lg p-2 group-hover:bg-primary/20 transition-colors flex-shrink-0">
              <Icon name={link.icon} size={20} className="text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors mb-1">
                {link.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">{link.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}
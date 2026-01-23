import { Link, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const routeNames: Record<string, string> = {
  '/': 'Главная',
  '/services': 'Услуги',
  '/register': 'Заявка на ипотеку',
  '/add-property': 'Добавить объект',
  '/privacy-policy': 'Политика конфиденциальности',
  '/terms-of-service': 'Условия использования',
  '/admin': 'Админ-панель',
  '/admin/articles': 'Управление статьями',
  '/admin/properties': 'Управление объектами',
  '/admin/reviews': 'Управление отзывами'
};

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) {
    return null;
  }

  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Главная', path: '/' }
  ];

  let currentPath = '';
  pathnames.forEach((segment) => {
    currentPath += `/${segment}`;
    const label = routeNames[currentPath] || segment;
    breadcrumbs.push({ label, path: currentPath });
  });

  return (
    <nav aria-label="Хлебные крошки" className="mb-4">
      <ol className="flex items-center gap-2 text-sm flex-wrap" itemScope itemType="https://schema.org/BreadcrumbList">
        {breadcrumbs.map((crumb, index) => (
          <li 
            key={crumb.path} 
            className="flex items-center gap-2"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && (
              <Icon name="ChevronRight" size={14} className="text-gray-400" />
            )}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-600 font-medium" itemProp="name">
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.path}
                className="text-primary hover:underline"
                itemProp="item"
              >
                <span itemProp="name">{crumb.label}</span>
              </Link>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
}

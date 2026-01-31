import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function PropertyRelatedLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Это может быть вам интересно</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link 
            to="/?tab=calculator" 
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="bg-primary/10 rounded-lg p-2">
              <Icon name="Calculator" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Калькулятор ипотеки</h3>
              <p className="text-xs text-gray-600">Рассчитайте платеж</p>
            </div>
          </Link>
          
          <Link 
            to="/services" 
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="bg-primary/10 rounded-lg p-2">
              <Icon name="Briefcase" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Наши услуги</h3>
              <p className="text-xs text-gray-600">Помощь в покупке</p>
            </div>
          </Link>
          
          <Link 
            to="/register" 
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="bg-primary/10 rounded-lg p-2">
              <Icon name="FileText" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Подать заявку</h3>
              <p className="text-xs text-gray-600">Оформить ипотеку</p>
            </div>
          </Link>
          
          <Link 
            to="/?tab=properties" 
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="bg-primary/10 rounded-lg p-2">
              <Icon name="Home" size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Другие объекты</h3>
              <p className="text-xs text-gray-600">Смотреть каталог</p>
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

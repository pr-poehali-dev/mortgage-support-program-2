import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gray-900 text-white mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Арендодатель</h3>
            <p className="text-gray-400 text-sm">
              Ипотечный центр в Севастополе. Помогаем с покупкой, продажей и арендой недвижимости.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate('/')} className="text-gray-400 hover:text-white transition-colors">
                  Главная
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/catalog')} className="text-gray-400 hover:text-white transition-colors">
                  Каталог
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/calculator')} className="text-gray-400 hover:text-white transition-colors">
                  Калькулятор
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/online-services')} className="text-gray-400 hover:text-white transition-colors">
                  Онлайн-услуги
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate('/blog')} className="text-gray-400 hover:text-white transition-colors">
                  Блог
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faq')} className="text-gray-400 hover:text-white transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="text-gray-400 hover:text-white transition-colors">
                  Контакты
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy-policy')} className="text-gray-400 hover:text-white transition-colors">
                  Политика конфиденциальности
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <Icon name="Phone" size={16} />
                <a href="tel:+79781281850" className="hover:text-white transition-colors">
                  +7 978 128-18-50
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="Mail" size={16} />
                <a href="mailto:ipoteka_krym@mail.ru" className="hover:text-white transition-colors">
                  ipoteka_krym@mail.ru
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="MapPin" size={16} />
                <span>г. Севастополь</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} ИП Николаев Дмитрий Юрьевич. Все права защищены.</p>
          <p className="mt-2">ИНН: 920360130683 | ОГРНИП: 318920400012912</p>
        </div>
      </div>
    </footer>
  );
}

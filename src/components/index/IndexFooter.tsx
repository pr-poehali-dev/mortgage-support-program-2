import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import AnimatedLogo from '@/components/AnimatedLogo';
import TagCloud from '@/components/TagCloud';

interface IndexFooterProps {
  setActiveTab: (tab: string) => void;
  theme: { name: string; primary: string; gradient: string };
}

export default function IndexFooter({ setActiveTab, theme }: IndexFooterProps) {
  const navigate = useNavigate();
  const [isTagsOpen, setIsTagsOpen] = useState(false);

  return (
    <footer className="bg-gray-900 text-white mt-8 sm:mt-12 py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div>
            <AnimatedLogo
              src="https://cdn.poehali.dev/files/с дескриптором белый вариант (1).png"
              alt="Арендодатель"
              className="h-12 w-auto object-contain mb-4"
            />
            <p className="text-sm text-gray-400 mb-2">Аренда и продажа недвижимости</p>
            <p className="text-sm text-gray-400 mb-4">Севастополь, Крым</p>
            <div className="flex gap-2">
              <a
                href="https://t.me/+79781281850"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors"
                title="Telegram"
              >
                <Icon name="Send" size={18} className="text-white" />
              </a>
              <a
                href="https://wa.me/79781281850"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center transition-colors"
                title="WhatsApp"
              >
                <Icon name="MessageCircle" size={18} className="text-white" />
              </a>
              <a
                href="viber://chat?number=%2B79781281850"
                className="w-9 h-9 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center justify-center transition-colors"
                title="Viber"
              >
                <Icon name="Smartphone" size={18} className="text-white" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-4">Ипотека</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button onClick={() => { setActiveTab('mortgage'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">
                  Калькулятор и программы
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/register')} className="hover:text-white transition-colors">
                  Подать заявку
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('faq'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">
                  Вопросы и ответы
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-4">Недвижимость</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button onClick={() => { setActiveTab('catalog'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">
                  Каталог недвижимости
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/add-property')} className="hover:text-white transition-colors">
                  Добавить объект
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/services')} className="hover:text-white transition-colors">
                  Услуги агентства
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-base mb-4">Информация</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
                  О компании
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('blog'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">
                  Блог и статьи
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('videos'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">
                  Видео
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">
                  Политика конфиденциальности
                </button>
              </li>
            </ul>
          </div>

          <div>
            <button 
              onClick={() => setIsTagsOpen(!isTagsOpen)}
              className="flex items-center gap-2 font-semibold text-base mb-4 hover:text-gray-300 transition-colors"
            >
              <span>Теги</span>
              <Icon name={isTagsOpen ? "ChevronUp" : "ChevronDown"} size={16} />
            </button>
            {isTagsOpen && (
              <div className="text-sm">
                <TagCloud />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/admin')}
                className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg flex items-center gap-2"
                title="Админ-панель"
              >
                <Icon name="Settings" size={24} />
              </button>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <p className="text-sm text-gray-400">
                  © {new Date().getFullYear()} Арендодатель. Все права защищены.
                </p>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Icon name="Palette" size={16} />
                  <span>Дизайн дня:</span>
                  <span className="font-semibold text-white">{theme.name}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-sm text-gray-400">
              <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">
                Конфиденциальность
              </button>
              <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">
                Условия использования
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
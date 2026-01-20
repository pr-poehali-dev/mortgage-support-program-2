import { useState } from 'react';

interface Tag {
  text: string;
  link: string;
  size: number;
}

const tags: Tag[] = [
  { text: 'банки севастополя', link: '/register', size: 2.8 },
  { text: 'ипотека севастополь', link: '/register', size: 3 },
  { text: 'семейная ипотека севастополь', link: '/register', size: 2.9 },
  { text: 'недвижимость в севастополе', link: '/#catalog', size: 2.7 },
  { text: 'аренда севастополь', link: '/#catalog', size: 2.5 },
  { text: 'мфц севастополь', link: '/register', size: 2.4 },
  { text: 'нотариус севастополь', link: '/register', size: 2.3 },
  { text: 'юрист севастополь', link: '/register', size: 2.2 },
  { text: 'посуточно севастополь', link: '/#catalog', size: 2.1 },
  { text: 'банк втб севастополь', link: '/register', size: 2.0 },
  { text: 'банк россия севастополь', link: '/register', size: 1.9 },
  { text: 'вклады в банках севастополя', link: '/register', size: 1.8 },
  { text: 'агентство недвижимости севастополь', link: '/#catalog', size: 1.8 },
  { text: 'купить ипотеку в севастополе', link: '/register', size: 1.9 },
  { text: 'авито севастополь недвижимость', link: '/#catalog', size: 1.7 },
  { text: 'военная ипотека севастополь', link: '/register', size: 1.8 },
  { text: 'адвокат севастополь', link: '/register', size: 1.6 },
  { text: 'купить недвижимость в севастополе', link: '/#catalog', size: 1.7 },
  { text: 'сельская ипотека севастополь', link: '/register', size: 1.6 },
  { text: 'новострой севастополь', link: '/#catalog', size: 1.5 },
  { text: 'риэлтор севастополь', link: '/#catalog', size: 1.4 },
  { text: 'бти севастополь', link: '/register', size: 1.5 },
  { text: 'этажи севастополь недвижимость', link: '/#catalog', size: 1.6 },
  { text: 'орлиное севастополь', link: '/#catalog', size: 1.4 },
  { text: 'байдарская долина севастополь', link: '/#catalog', size: 1.5 },
];

export default function TagCloud() {
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);

  const handleTagClick = (link: string) => {
    if (link.startsWith('/#')) {
      const hash = link.substring(2);
      const element = document.querySelector(`[value="${hash}"]`);
      if (element) {
        (element as HTMLElement).click();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      window.location.href = link;
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 text-center">
        🏷️ Популярные запросы
      </h2>
      
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
        {tags.map((tag, index) => (
          <button
            key={index}
            onClick={() => handleTagClick(tag.link)}
            onMouseEnter={() => setHoveredTag(tag.text)}
            onMouseLeave={() => setHoveredTag(null)}
            className="px-4 py-2 rounded-full transition-all duration-300 transform hover:scale-110"
            style={{
              fontSize: `${tag.size * 0.5}rem`,
              backgroundColor: hoveredTag === tag.text 
                ? 'rgb(59 130 246)' 
                : 'white',
              color: hoveredTag === tag.text 
                ? 'white' 
                : 'rgb(59 130 246)',
              boxShadow: hoveredTag === tag.text 
                ? '0 4px 12px rgba(59, 130, 246, 0.3)' 
                : '0 2px 8px rgba(0, 0, 0, 0.1)',
              fontWeight: tag.size > 2.5 ? 'bold' : 'normal',
            }}
          >
            {tag.text}
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Нажмите на тег для быстрого перехода к нужному разделу
      </p>
    </div>
  );
}
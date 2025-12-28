import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { crimeaCities } from '@/data/crimea-cities';

interface CrimeaMapSVGProps {
  filteredCities: typeof crimeaCities;
  onCityClick: (cityName: string) => void;
}

export default function CrimeaMapSVG({ filteredCities, onCityClick }: CrimeaMapSVGProps) {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 mb-8 shadow-lg">
      <svg viewBox="0 0 1134 760" className="w-full h-auto" style={{ maxHeight: '700px' }}>
        <defs>
          <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dcfce7" />
            <stop offset="50%" stopColor="#bbf7d0" />
            <stop offset="100%" stopColor="#86efac" />
          </linearGradient>
          
          <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="100%" stopColor="#bfdbfe" />
          </linearGradient>
          
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d6d3d1" />
            <stop offset="100%" stopColor="#a8a29e" />
          </linearGradient>
          
          <filter id="dropShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
            <feOffset dx="2" dy="4" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.4"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect x="0" y="0" width="1134" height="760" fill="url(#seaGradient)"/>
        
        <image 
          href="https://cdn.poehali.dev/files/Crimea_location_map.svg.png" 
          x="0" 
          y="0" 
          width="1134" 
          height="760"
          opacity="0.85"
          preserveAspectRatio="xMidYMid slice"
        />
        
        <path
          d="M 30 380 L 40 370 L 55 360 L 75 350 L 100 340 L 130 330 
             L 165 320 L 205 312 L 250 306 L 300 302 L 355 300 L 415 300 
             L 480 302 L 550 306 L 625 312 L 705 320 L 790 330 L 875 342 
             L 955 356 L 1025 372 L 1080 390 L 1115 408 L 1130 426 L 1132 444 
             L 1125 462 L 1110 478 L 1087 492 L 1057 504 L 1020 514 L 978 522 
             L 931 528 L 880 532 L 825 534 L 767 534 L 707 532 L 645 528 
             L 582 522 L 518 514 L 455 504 L 393 492 L 333 478 L 276 462 
             L 223 444 L 174 424 L 130 402 L 92 378 L 60 352 L 35 324 
             L 18 294 L 10 262 L 12 228 L 24 194 L 46 162 L 78 134 
             L 120 110 L 172 92 L 234 80 L 306 74 L 388 74 L 480 80 
             L 582 92 L 694 110 L 816 134 L 948 164 L 1070 198 L 1115 220 
             L 1130 238 L 1132 254 L 1125 268 L 1110 280 L 1087 290 L 1057 298 
             L 1020 304 L 978 308 L 931 310 L 880 310 L 825 308 L 767 304 
             L 707 298 L 645 290 L 582 280 L 518 268 L 455 254 L 393 238 
             L 333 220 L 276 200 L 223 178 L 174 154 L 130 128 L 92 100 
             L 60 70 L 35 38 L 18 4 Z"
          fill="none"
          stroke="#0284c7"
          strokeWidth="4"
          filter="url(#dropShadow)"
        />
        

        
        <text x="150" y="720" fontSize="24" fill="#0369a1" fontWeight="700" fontFamily="system-ui">
          Чёрное море
        </text>
        
        <text x="950" y="150" fontSize="20" fill="#0369a1" fontWeight="700" fontFamily="system-ui">
          Азовское
        </text>
        <text x="970" y="175" fontSize="20" fill="#0369a1" fontWeight="700" fontFamily="system-ui">
          море
        </text>
        
        {filteredCities.map((city) => {
          const isLarge = city.size === 'large';
          const isMedium = city.size === 'medium';
          const dotRadius = isLarge ? 10 : isMedium ? 7 : 5;
          const fontSize = isLarge ? 16 : isMedium ? 13 : 11;
          const color = city.name === 'Севастополь' ? '#2563eb' : city.name === 'Симферополь' ? '#dc2626' : '#7c3aed';
          
          const labelOffsetY = isLarge ? -22 : isMedium ? -18 : -14;
          
          return (
            <g 
              key={city.name} 
              className="cursor-pointer group transition-all" 
              onClick={() => onCityClick(city.name)}
            >
              <circle 
                cx={city.x} 
                cy={city.y} 
                r={dotRadius + 4} 
                fill={color} 
                opacity="0.2"
                className="group-hover:opacity-40 transition-all"
              />
              
              <circle 
                cx={city.x} 
                cy={city.y} 
                r={dotRadius} 
                fill={color} 
                stroke="white"
                strokeWidth="2.5"
                className="group-hover:scale-125 transition-transform drop-shadow-lg" 
              />
              
              {isLarge && (
                <circle 
                  cx={city.x} 
                  cy={city.y} 
                  r={dotRadius + 10} 
                  fill="none" 
                  stroke={color} 
                  strokeWidth="2.5" 
                  opacity="0.5"
                  className="animate-pulse" 
                />
              )}
              
              <rect
                x={city.x - (city.name.length * (fontSize / 2.3)) / 2 - 6}
                y={city.y + labelOffsetY - fontSize - 3}
                width={city.name.length * (fontSize / 2.3) + 12}
                height={fontSize + 8}
                fill="white"
                opacity="0.95"
                rx="4"
                className="group-hover:opacity-100 transition-all drop-shadow-md"
              />
              
              <text 
                x={city.x} 
                y={city.y + labelOffsetY} 
                fontSize={fontSize} 
                fill={color}
                fontWeight="600" 
                textAnchor="middle"
                fontFamily="system-ui"
                className="pointer-events-none select-none group-hover:font-bold transition-all"
              >
                {city.name}
              </text>
            </g>
          );
        })}
      </svg>
      
      <div className="space-y-4 mt-6">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <span className="font-medium text-gray-700">Симферополь (столица)</span>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
            <div className="w-4 h-4 rounded-full bg-blue-600"></div>
            <span className="font-medium text-gray-700">Севастополь (город федерального значения)</span>
          </div>
          
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
            <div className="w-4 h-4 rounded-full bg-purple-600"></div>
            <span className="font-medium text-gray-700">Другие населённые пункты</span>
          </div>
        </div>
        
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 p-4">
          <div className="flex items-start gap-3">
            <Icon name="Info" className="text-blue-600 mt-1 flex-shrink-0" size={20} />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">
                Нажмите на любой населённый пункт для оставления заявки
              </p>
              <p className="text-xs text-gray-600">
                На карте отображены все города и посёлки городского типа (ПГТ) Крыма, где доступны ипотечные программы.
                Используйте поиск или фильтры выше для быстрого поиска нужного населённого пункта.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
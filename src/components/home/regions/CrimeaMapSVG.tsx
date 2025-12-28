import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { crimeaCities } from '@/data/crimea-cities';

interface CrimeaMapSVGProps {
  filteredCities: typeof crimeaCities;
  onCityClick: (cityName: string) => void;
}

export default function CrimeaMapSVG({ filteredCities, onCityClick }: CrimeaMapSVGProps) {
  return (
    <div className="relative bg-white rounded-xl p-8 mb-8 shadow-lg">
      <svg viewBox="0 0 800 400" className="w-full h-auto">
        <defs>
          <linearGradient id="crimeaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.6" />
          </linearGradient>
          
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#78716c" />
            <stop offset="100%" stopColor="#a8a29e" />
          </linearGradient>
          
          <linearGradient id="seaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.2" />
          </linearGradient>
          
          <filter id="shadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="2" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <pattern id="waves" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
            <path d="M 0 10 Q 10 5 20 10 T 40 10" stroke="#0284c7" strokeWidth="1" fill="none" opacity="0.3"/>
            <path d="M 0 15 Q 10 10 20 15 T 40 15" stroke="#0ea5e9" strokeWidth="0.5" fill="none" opacity="0.2"/>
          </pattern>
        </defs>
        
        <rect x="0" y="0" width="800" height="400" fill="url(#seaGradient)"/>
        <rect x="0" y="0" width="800" height="400" fill="url(#waves)"/>
        
        <path
          d="M 85 205 
             C 90 200, 95 195, 105 190
             L 115 185 Q 125 180, 135 175
             L 145 168 Q 155 162, 165 157
             C 175 152, 185 148, 195 145
             Q 210 141, 225 139
             L 245 138 Q 260 139, 275 143
             L 290 148 Q 305 152, 320 156
             L 335 159 Q 348 161, 360 161
             L 375 160 Q 388 158, 400 154
             L 415 149 Q 428 145, 440 143
             L 455 141 Q 468 140, 480 141
             L 495 144 Q 508 148, 520 154
             L 535 162 Q 548 170, 560 178
             L 575 188 Q 588 196, 600 202
             L 615 209 Q 628 215, 640 220
             L 655 227 Q 668 234, 680 242
             L 692 251 Q 702 260, 710 270
             L 716 281 Q 720 292, 722 303
             L 723 315 Q 722 326, 719 336
             L 714 347 Q 708 357, 700 366
             L 690 375 Q 679 383, 666 390
             L 650 397 Q 633 403, 615 407
             L 595 411 Q 575 414, 555 416
             L 535 417 Q 515 417, 495 416
             L 475 414 Q 455 411, 435 407
             L 415 402 Q 395 397, 376 390
             L 357 383 Q 339 375, 322 366
             L 305 356 Q 289 346, 274 335
             L 260 324 Q 247 313, 235 301
             L 223 289 Q 212 277, 202 265
             L 192 252 Q 183 239, 175 226
             L 168 214 Q 162 202, 157 190
             L 152 179 Q 148 168, 145 157
             L 142 146 Q 140 135, 139 124
             L 138 113 Q 138 102, 139 91
             L 141 81 Q 144 71, 148 62
             L 153 53 Q 159 45, 166 38
             L 174 32 Q 183 27, 193 23
             Z"
          fill="url(#crimeaGradient)"
          stroke="#047857"
          strokeWidth="2.5"
          filter="url(#shadow)"
          className="transition-all hover:brightness-110"
        />
        
        <path
          d="M 400 310 Q 420 305, 440 308 L 460 312 Q 480 315, 500 318 L 520 320 Q 540 321, 560 320 L 580 318 Q 600 315, 615 310"
          fill="url(#mountainGradient)"
          opacity="0.4"
          stroke="#78716c"
          strokeWidth="1"
        />
        <path
          d="M 410 315 Q 430 312, 450 314 L 470 317 Q 490 319, 510 321 L 530 322 Q 550 322, 570 320"
          fill="url(#mountainGradient)"
          opacity="0.3"
          stroke="#a8a29e"
          strokeWidth="0.5"
        />
        
        <path
          d="M 680 242 L 695 237 Q 710 233, 725 232 L 740 233 Q 753 236, 765 241 L 775 248"
          stroke="#047857"
          strokeWidth="2"
          fill="none"
        />
        
        <path
          d="M 145 168 Q 135 163, 128 158 L 122 152"
          stroke="#047857"
          strokeWidth="2"
          fill="none"
        />
        
        <path
          d="M 400 220 Q 410 230, 415 245 L 418 260"
          stroke="#0ea5e9"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M 520 210 Q 530 225, 535 240"
          stroke="#0ea5e9"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
        />
        
        <g opacity="0.3">
          <path d="M 240 180 L 340 200 M 340 200 L 420 220 M 420 220 L 480 230" stroke="#047857" strokeWidth="0.8" strokeDasharray="3,3" fill="none"/>
          <path d="M 280 240 L 380 260 M 380 260 L 460 280 M 460 280 L 540 290" stroke="#047857" strokeWidth="0.8" strokeDasharray="3,3" fill="none"/>
          <path d="M 200 280 L 280 300 M 280 300 L 360 320 M 360 320 L 440 330 M 440 330 L 520 335" stroke="#047857" strokeWidth="0.8" strokeDasharray="3,3" fill="none"/>
          <path d="M 300 180 L 300 300" stroke="#047857" strokeWidth="0.8" strokeDasharray="3,3" fill="none"/>
          <path d="M 400 180 L 400 310" stroke="#047857" strokeWidth="0.8" strokeDasharray="3,3" fill="none"/>
          <path d="M 500 190 L 500 330" stroke="#047857" strokeWidth="0.8" strokeDasharray="3,3" fill="none"/>
          <path d="M 600 210 L 600 340" stroke="#047857" strokeWidth="0.8" strokeDasharray="3,3" fill="none"/>
        </g>
        
        <text x="100" y="330" fontSize="18" fill="#0284c7" fontStyle="italic" opacity="0.6" fontWeight="600">
          Чёрное море
        </text>
        
        <text x="650" y="100" fontSize="16" fill="#0284c7" fontStyle="italic" opacity="0.6" fontWeight="600">
          Азовское
        </text>
        <text x="660" y="118" fontSize="16" fill="#0284c7" fontStyle="italic" opacity="0.6" fontWeight="600">
          море
        </text>
        
        {filteredCities.map((city) => {
          const radius = city.size === 'large' ? 20 : city.size === 'medium' ? 12 : 8;
          const fontSize = city.size === 'large' ? '11' : city.size === 'medium' ? '8' : '6';
          const color = city.name === 'Севастополь' ? '#3b82f6' : '#8b5cf6';
          
          return (
            <g 
              key={city.name} 
              className="cursor-pointer group" 
              onClick={() => onCityClick(city.name)}
            >
              <circle 
                cx={city.x} 
                cy={city.y} 
                r={radius} 
                fill={color} 
                className="group-hover:opacity-100 transition-all" 
                opacity="0.8" 
              />
              {city.size === 'large' && (
                <circle 
                  cx={city.x} 
                  cy={city.y} 
                  r={radius + 5} 
                  fill="none" 
                  stroke={color} 
                  strokeWidth="2" 
                  className="animate-pulse" 
                />
              )}
              <text 
                x={city.x} 
                y={city.y + parseInt(fontSize)/3} 
                fontSize={fontSize} 
                fill="white" 
                fontWeight="bold" 
                textAnchor="middle"
                className="pointer-events-none"
              >
                {city.name.substring(0, city.size === 'large' ? 3 : 2).toUpperCase()}
              </text>
              <title>{city.name}</title>
            </g>
          );
        })}
      </svg>
      
      <div className="space-y-4 mt-6">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-600"></div>
            <span className="text-gray-700">Севастополь</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-purple-600"></div>
            <span className="text-gray-700">Города Крыма</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-green-700 opacity-30" style={{borderTop: '1px dashed #047857'}}></div>
            <span className="text-gray-700">Границы районов</span>
          </div>
        </div>
        
        <Card className="p-4 bg-gradient-to-br from-green-50 to-blue-50">
          <h4 className="font-semibold text-gray-900 mb-3 text-center">Административные районы Республики Крым</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Icon name="MapPin" size={12} className="text-green-600" />
              <span>Бахчисарайский</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="MapPin" size={12} className="text-green-600" />
              <span>Белогорский</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="MapPin" size={12} className="text-green-600" />
              <span>Джанкойский</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="MapPin" size={12} className="text-green-600" />
              <span>Кировский</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="MapPin" size={12} className="text-green-600" />
              <span>Красногвардейский</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="MapPin" size={12} className="text-green-600" />
              <span>Красноперекопский</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="MapPin" size={12} className="text-green-600" />
              <span>Ленинский</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="MapPin" size={12} className="text-green-600" />
              <span>Нижнегорский</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="MapPin" size={12} className="text-green-600" />
              <span>Первомайский</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="MapPin" size={12} className="text-green-600" />
              <span>Раздольненский</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="MapPin" size={12} className="text-green-600" />
              <span>Сакский</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="MapPin" size={12} className="text-green-600" />
              <span>Симферопольский</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="MapPin" size={12} className="text-green-600" />
              <span>Советский</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icon name="MapPin" size={12} className="text-green-600" />
              <span>Черноморский</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center">
              + города республиканского значения: Симферополь, Алушта, Армянск, Джанкой, Евпатория, Керчь, Красноперекопск, Саки, Судак, Феодосия, Ялта
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

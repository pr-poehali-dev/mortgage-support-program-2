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
      <svg viewBox="0 0 1000 500" className="w-full h-auto" style={{ maxHeight: '600px' }}>
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
        
        <rect x="0" y="0" width="1000" height="500" fill="url(#seaGradient)"/>
        
        <path
          d="M 120 250
             L 130 240 L 140 235 L 155 228 L 170 222 
             L 190 217 L 210 214 L 230 212 L 250 211 
             L 275 212 L 300 215 L 325 220 L 350 226 
             L 375 232 L 400 237 L 425 241 L 450 244 
             L 475 246 L 500 247 L 525 247 L 550 246 
             L 575 244 L 600 242 L 625 240 L 650 239 
             L 675 239 L 700 241 L 725 245 L 750 251 
             L 775 259 L 800 268 L 820 278 L 835 288 
             L 845 298 L 852 308 L 856 318 L 858 328 
             L 857 338 L 853 348 L 846 357 L 836 365 
             L 823 372 L 808 378 L 790 383 L 770 387 
             L 748 390 L 725 392 L 700 393 L 675 393 
             L 650 392 L 625 390 L 600 387 L 575 384 
             L 550 381 L 525 378 L 500 375 L 475 372 
             L 450 370 L 425 368 L 400 367 L 375 367 
             L 350 368 L 325 370 L 300 373 L 275 377 
             L 250 382 L 225 388 L 200 395 L 178 403 
             L 158 412 L 140 420 L 125 427 L 113 433 
             L 105 438 L 100 442 L 98 445 L 100 448 
             L 105 450 L 112 450 L 120 447 L 127 443 
             L 133 438 L 138 432 L 142 425 L 145 418 
             L 147 410 L 148 402 L 148 394 L 147 386 
             L 145 378 L 142 370 L 138 362 L 133 354 
             L 127 346 L 120 338 L 112 330 L 103 323 
             L 93 316 L 83 310 L 74 305 L 66 301 
             L 60 298 L 55 295 L 52 293 L 50 291 
             L 50 289 L 52 287 L 56 285 L 62 283 
             L 70 281 L 80 279 L 92 277 L 106 275 
             L 120 273 L 134 271 L 148 269 L 162 267 
             L 175 265 L 187 263 L 198 261 L 208 259 
             L 217 257 L 225 255 L 232 253 L 238 251 
             L 243 249 L 247 247 L 250 245 L 252 243 
             L 253 241 L 253 239 L 252 237 L 250 235 
             L 247 233 L 243 231 L 238 229 L 232 227 
             L 225 225 L 217 223 L 208 221 L 198 219 
             L 187 217 L 175 215 L 162 213 L 148 211 
             L 134 209 L 120 207 L 106 206 L 92 205 
             L 80 205 L 70 206 L 62 207 L 56 209 
             L 52 211 L 50 213 L 50 216 L 52 219 
             L 55 222 L 60 226 L 66 230 L 74 235 
             L 83 240 L 93 246 L 103 252 L 112 258 
             L 120 264 L 127 270 L 133 276 L 138 282 
             L 142 288 L 145 294 L 147 300 L 148 306 
             L 148 312 L 147 318 L 145 324 L 142 330 
             L 138 336 L 133 342 L 127 348 L 120 354 
             Z"
          fill="url(#landGradient)"
          stroke="#22c55e"
          strokeWidth="3"
          filter="url(#dropShadow)"
        />
        
        <path
          d="M 450 340 Q 500 335, 550 340 Q 600 345, 650 342 Q 680 340, 700 338"
          fill="url(#mountainGradient)"
          opacity="0.5"
          stroke="#78716c"
          strokeWidth="1.5"
        />
        <path
          d="M 460 345 Q 510 340, 560 345 Q 610 348, 650 346"
          fill="url(#mountainGradient)"
          opacity="0.3"
          stroke="#a8a29e"
          strokeWidth="1"
        />
        
        <text x="120" y="470" fontSize="20" fill="#0369a1" fontWeight="700" fontFamily="system-ui">
          Чёрное море
        </text>
        
        <text x="780" y="180" fontSize="18" fill="#0369a1" fontWeight="700" fontFamily="system-ui">
          Азовское море
        </text>
        
        {filteredCities.map((city) => {
          const isLarge = city.size === 'large';
          const isMedium = city.size === 'medium';
          const dotRadius = isLarge ? 8 : isMedium ? 6 : 4;
          const fontSize = isLarge ? 14 : isMedium ? 12 : 10;
          const color = city.name === 'Севастополь' ? '#2563eb' : city.name === 'Симферополь' ? '#dc2626' : '#7c3aed';
          
          const labelOffsetY = isLarge ? -18 : isMedium ? -15 : -12;
          
          return (
            <g 
              key={city.name} 
              className="cursor-pointer group transition-all" 
              onClick={() => onCityClick(city.name)}
            >
              <circle 
                cx={city.x} 
                cy={city.y} 
                r={dotRadius + 3} 
                fill={color} 
                opacity="0.15"
                className="group-hover:opacity-30 transition-all"
              />
              
              <circle 
                cx={city.x} 
                cy={city.y} 
                r={dotRadius} 
                fill={color} 
                stroke="white"
                strokeWidth="2"
                className="group-hover:scale-125 transition-transform" 
              />
              
              {isLarge && (
                <circle 
                  cx={city.x} 
                  cy={city.y} 
                  r={dotRadius + 8} 
                  fill="none" 
                  stroke={color} 
                  strokeWidth="2" 
                  opacity="0.4"
                  className="animate-pulse" 
                />
              )}
              
              <rect
                x={city.x - (city.name.length * (fontSize / 2.2)) / 2 - 4}
                y={city.y + labelOffsetY - fontSize - 2}
                width={city.name.length * (fontSize / 2.2) + 8}
                height={fontSize + 6}
                fill="white"
                opacity="0.95"
                rx="3"
                className="group-hover:opacity-100 transition-all"
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

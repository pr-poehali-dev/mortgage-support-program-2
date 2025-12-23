import { useDailyTheme } from '@/hooks/useDailyTheme';
import Icon from '@/components/ui/icon';

interface ThemeIndicatorProps {
  inline?: boolean;
}

export default function ThemeIndicator({ inline = false }: ThemeIndicatorProps) {
  const theme = useDailyTheme();

  if (inline) {
    return (
      <div className="flex items-center gap-2 text-gray-300">
        <Icon name="Palette" size={16} />
        <span className="text-sm">Дизайн дня: <span className="font-semibold">{theme.name}</span></span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 left-4 z-40 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2">
      <Icon name="Palette" size={18} className="text-gray-600" />
      <div className="text-sm">
        <span className="text-gray-600">Дизайн дня:</span>
        <span className="font-semibold ml-1 bg-gradient-to-r text-transparent bg-clip-text" style={{
          backgroundImage: `linear-gradient(to right, ${theme.primary.includes('blue') ? '#2563eb, #9333ea' : 
            theme.primary.includes('emerald') ? '#059669, #0d9488' :
            theme.primary.includes('orange') ? '#ea580c, #f59e0b' :
            theme.primary.includes('pink') ? '#db2777, #f43f5e' :
            theme.primary.includes('indigo') ? '#4f46e5, #7c3aed' :
            theme.primary.includes('cyan') ? '#0891b2, #0284c7' :
            '#9333ea, #c026d3'})`
        }}>
          {theme.name}
        </span>
      </div>
    </div>
  );
}
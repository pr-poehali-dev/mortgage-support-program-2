import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
}

export default function ShareButton({ 
  title = document.title,
  text = '',
  url = window.location.href,
  className = ''
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const shareLinks = {
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
    vk: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
    ok: `https://connect.ok.ru/offer?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: 'Ссылка скопирована',
        description: 'Ссылка успешно скопирована в буфер обмена',
      });
      setIsOpen(false);
    } catch (err) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось скопировать ссылку',
        variant: 'destructive',
      });
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        setIsOpen(false);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share error:', err);
        }
      }
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 ${className}`}
        >
          <Icon name="Share2" size={16} />
          <span className="hidden sm:inline">Поделиться</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyLink}>
          <Icon name="Link" size={16} className="mr-2" />
          Скопировать ссылку
        </DropdownMenuItem>
        
        {navigator.share && (
          <DropdownMenuItem onClick={handleNativeShare}>
            <Icon name="Share" size={16} className="mr-2" />
            Поделиться...
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={() => handleShare('telegram')}>
          <Icon name="Send" size={16} className="mr-2" />
          Telegram
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
          <Icon name="MessageCircle" size={16} className="mr-2" />
          WhatsApp
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('vk')}>
          <Icon name="Share2" size={16} className="mr-2" />
          ВКонтакте
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleShare('ok')}>
          <Icon name="Users" size={16} className="mr-2" />
          Одноклассники
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

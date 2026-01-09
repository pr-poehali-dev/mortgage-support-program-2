import { useEffect, useState } from 'react';

interface AnimatedLogoProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

export default function AnimatedLogo({ src, alt, className, onClick }: AnimatedLogoProps) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const triggerAnimation = () => {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 2000);
    };

    triggerAnimation();
    const interval = setInterval(triggerAnimation, 20000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`logo-container ${animate ? 'animate-smoke' : ''}`}>
      <img 
        src={src}
        alt={alt}
        className={className}
        onClick={onClick}
      />
    </div>
  );
}

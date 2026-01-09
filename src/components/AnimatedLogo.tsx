import { useEffect, useState } from 'react';

interface AnimatedLogoProps {
  src: string;
  alt: string;
  className?: string;
  onClick?: () => void;
}

export default function AnimatedLogo({ src, alt, className, onClick }: AnimatedLogoProps) {
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div className="logo-animated-wrapper" onClick={onClick}>
      <img 
        src={src}
        alt={alt}
        className={className}
      />
      <div className={`smoke-overlay ${animate ? 'animate' : ''}`}>
        <img 
          src={src}
          alt=""
          className={className}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
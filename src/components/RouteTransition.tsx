import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function RouteTransition() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-transparent">
      <div className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-[shimmer_1s_ease-in-out_infinite] bg-[length:200%_100%]" />
    </div>
  );
}

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Programs() {
  const navigate = useNavigate();

  useEffect(() => {
    // Перенаправление на главную с открытым разделом "Ипотека"
    navigate('/?tab=mortgage&subtab=programs', { replace: true });
  }, [navigate]);

  return null;
}
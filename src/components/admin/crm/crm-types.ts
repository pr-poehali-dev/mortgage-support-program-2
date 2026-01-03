export interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  requests_count?: number;
}

export interface Request {
  id: number;
  client_id: number;
  city: string;
  service_type: string;
  message: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
  name: string;
  full_name?: string;
  phone: string;
  email: string;
  source: string;
  property_type?: string;
  property_address?: string;
  property_cost?: number;
  initial_payment?: number;
  credit_term?: number;
  birth_date?: string;
  monthly_income?: number;
  employment_type?: string;
  registration_completed?: boolean;
}

export interface QuizResult {
  category: string;
  region: string;
  loan_amount_range: string;
  recommended_program: string;
  count: number;
  last_taken: string;
}

export const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500',
  in_progress: 'bg-yellow-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500'
};

export const STATUS_LABELS: Record<string, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  completed: 'Завершена',
  cancelled: 'Отменена'
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-red-500'
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий'
};

export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'только что';
  if (diffMins < 60) return `${diffMins} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays < 7) return `${diffDays} дн. назад`;
  return past.toLocaleDateString('ru', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function isNewRequest(dateString: string): boolean {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  return diffMins < 5;
}

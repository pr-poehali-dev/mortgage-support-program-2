# Публичный API для аналитики и функций сайта

## 📋 Обзор

Этот документ описывает публичные функции и API, доступные для использования в проекте и внешних интеграциях.

## 🎯 Модуль аналитики: `analytics.ts` (РЕКОМЕНДУЕТСЯ)

**⚠️ ВАЖНО**: Используйте модуль `analytics.ts` для отправки событий **сразу в обе системы** (Яндекс.Метрика + Google Analytics 4).

### Импорт функций

```typescript
import {
  // Основные цели
  trackApplicationSent,
  trackPhoneClick,
  trackTelegramClick,
  trackCalculatorUsed,
  trackQuizCompleted,
  trackProgramViewed,
  trackExcelDownload,
  trackEmailReport,
  trackTabChanged,
  
  // Цели для карты регионов
  trackCitySelected,
  trackFormSubmitted,
  trackMapInteraction,
  trackSearchUsed,
  trackFilterChanged,
} from '@/services/analytics';  // ← Используйте этот модуль!
```

### Для работы только с одной системой:

```typescript
// Только Яндекс.Метрика
import { ... } from '@/services/metrika-goals';

// Только Google Analytics 4
import { ... } from '@/services/ga4-events';
```

## 📚 Документация функций

### trackApplicationSent()
Отслеживание отправки заявки на ипотеку.

```typescript
trackApplicationSent(
  programType: string,  // Тип программы: 'family', 'it', 'rural', 'military', 'base'
  amount?: number       // Сумма ипотеки (опционально)
): void
```

**Пример:**
```typescript
trackApplicationSent('family', 5000000);
trackApplicationSent('it');
```

---

### trackPhoneClick()
Отслеживание клика по номеру телефона.

```typescript
trackPhoneClick(
  source?: string  // Источник клика: 'header', 'footer', 'form' и т.д.
): void
```

**Пример:**
```typescript
trackPhoneClick('header');
trackPhoneClick('cta_section');
```

---

### trackTelegramClick()
Отслеживание клика по ссылке Telegram.

```typescript
trackTelegramClick(): void
```

**Пример:**
```typescript
trackTelegramClick();
```

---

### trackCalculatorUsed()
Отслеживание использования калькулятора ипотеки.

```typescript
trackCalculatorUsed(
  amount: number,  // Сумма ипотеки
  term: number,    // Срок в месяцах
  rate: number     // Процентная ставка
): void
```

**Пример:**
```typescript
trackCalculatorUsed(3000000, 180, 6.5);
```

---

### trackQuizCompleted()
Отслеживание завершения квиза по подбору ипотеки.

```typescript
trackQuizCompleted(
  result: string  // Результат квиза
): void
```

**Пример:**
```typescript
trackQuizCompleted('family_mortgage');
```

---

### trackProgramViewed()
Отслеживание просмотра программы ипотеки.

```typescript
trackProgramViewed(
  programName: string  // Название программы
): void
```

**Пример:**
```typescript
trackProgramViewed('Семейная ипотека');
```

---

### trackExcelDownload()
Отслеживание скачивания Excel отчета.

```typescript
trackExcelDownload(
  reportType: string  // Тип отчета
): void
```

**Пример:**
```typescript
trackExcelDownload('payment_schedule');
```

---

### trackEmailReport()
Отслеживание отправки отчета на email.

```typescript
trackEmailReport(
  email: string  // Email пользователя (маскируется автоматически)
): void
```

**Пример:**
```typescript
trackEmailReport('user@example.com');
// Отправит: use***@example.com
```

---

### trackTabChanged()
Отслеживание переключения вкладок.

```typescript
trackTabChanged(
  tabName: string  // Название вкладки
): void
```

**Пример:**
```typescript
trackTabChanged('calculator');
```

---

### trackCitySelected()
Отслеживание выбора города на карте.

```typescript
trackCitySelected(
  cityName: string  // Название города
): void
```

**Пример:**
```typescript
trackCitySelected('Симферополь');
```

---

### trackFormSubmitted()
Отслеживание отправки формы заявки с указанием города и источника.

```typescript
trackFormSubmitted(
  city: string,    // Город
  source: string   // Источник: 'region_map', 'hero', 'footer'
): void
```

**Пример:**
```typescript
trackFormSubmitted('Ялта', 'region_map');
```

---

### trackMapInteraction()
Отслеживание взаимодействия с интерактивной картой.

```typescript
trackMapInteraction(
  action: string  // Действие: 'click', 'hover', 'zoom'
): void
```

**Пример:**
```typescript
trackMapInteraction('city_click');
```

---

### trackSearchUsed()
Отслеживание использования поиска городов.

```typescript
trackSearchUsed(
  query: string  // Поисковый запрос (обрезается до 50 символов)
): void
```

**Пример:**
```typescript
trackSearchUsed('Феодосия');
```

---

### trackFilterChanged()
Отслеживание изменения фильтра городов.

```typescript
trackFilterChanged(
  filterType: string,  // Тип фильтра: 'all', 'city', 'town'
  count: number        // Количество результатов
): void
```

**Пример:**
```typescript
trackFilterChanged('city', 11);
```

---

### reachGoal()
Универсальная функция для отправки кастомных целей.

```typescript
reachGoal(
  goal: string,                      // Название цели
  params?: Record<string, any>       // Параметры (опционально)
): void
```

**Пример:**
```typescript
reachGoal('custom_action', {
  category: 'engagement',
  value: 100
});
```

---

## 🔧 Константы

### MetrikaGoals
Объект с константами всех доступных целей:

```typescript
export const MetrikaGoals = {
  APPLICATION_SENT: 'application_sent',
  PHONE_CLICK: 'phone_click',
  TELEGRAM_CLICK: 'telegram_click',
  CALCULATOR_USED: 'calculator_used',
  QUIZ_COMPLETED: 'quiz_completed',
  PROGRAM_VIEWED: 'program_viewed',
  EXCEL_DOWNLOAD: 'excel_download',
  EMAIL_REPORT: 'email_report',
  TAB_CHANGED: 'tab_changed',
  CITY_SELECTED: 'city_selected',
  FORM_SUBMITTED: 'form_submitted',
  MAP_INTERACTION: 'map_interaction',
  SEARCH_USED: 'search_used',
  FILTER_CHANGED: 'filter_changed',
} as const;
```

**Использование:**
```typescript
import { MetrikaGoals, reachGoal } from '@/services/metrika-goals';

reachGoal(MetrikaGoals.PHONE_CLICK, { source: 'footer' });
```

---

## 🌐 Backend функции

### Telegram уведомления
**Endpoint**: `https://functions.poehali.dev/927c8f65-0024-4ded-8d22-24987e241c4e`

**Метод**: POST

**Тело запроса**:
```json
{
  "name": "Иван Петров",
  "phone": "+79781234567",
  "city": "Симферополь"
}
```

**Ответ (успех)**:
```json
{
  "success": true,
  "message": "Notification sent"
}
```

**Пример использования**:
```javascript
const response = await fetch(
  'https://functions.poehali.dev/927c8f65-0024-4ded-8d22-24987e241c4e',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name,
      phone: formData.phone,
      city: formData.city
    })
  }
);

const result = await response.json();
if (result.success) {
  console.log('Заявка отправлена');
}
```

---

## 🔐 Безопасность

### CORS
Все функции поддерживают CORS запросы с любых доменов.

### Защита данных
- Email адреса маскируются перед отправкой в аналитику
- Телефоны не передаются в метрику (только факт клика)
- Персональные данные отправляются только в Telegram (защищённый канал)

---

## 📊 Мониторинг

Все события автоматически логируются в консоль (в dev режиме):
```javascript
console.log('Metrika goal: application_sent', { program: 'family', amount: 5000000 });
```

В production логи скрыты, но события отправляются в Яндекс.Метрику.

---

## 🚀 Интеграция в новые компоненты

### Шаг 1: Импорт
```typescript
import { trackPhoneClick } from '@/services/metrika-goals';
```

### Шаг 2: Использование в обработчике
```typescript
function handleClick() {
  trackPhoneClick('new_section');
  // ... остальная логика
}
```

### Шаг 3: Добавление в JSX
```tsx
<button onClick={handleClick}>
  Позвонить
</button>
```

---

## 📈 Отладка

### Проверка работы в браузере
1. Откройте консоль разработчика (F12)
2. Выполните любое действие с трекингом
3. Проверьте логи: `Metrika goal: ...`

### Проверка в Яндекс.Метрике
1. Откройте https://metrika.yandex.ru/dashboard?id=105974763
2. Перейдите в "Отчеты" → "Конверсии" → "Цели"
3. Проверьте, что цели срабатывают

---

## 🆕 Добавление новых целей

### Шаг 1: Добавить константу
```typescript
// src/services/metrika-goals.ts
export const MetrikaGoals = {
  // ... существующие
  NEW_GOAL: 'new_goal',
} as const;
```

### Шаг 2: Создать функцию
```typescript
export function trackNewGoal(param: string) {
  reachGoal(MetrikaGoals.NEW_GOAL, {
    parameter: param,
  });
}
```

### Шаг 3: Использовать
```typescript
import { trackNewGoal } from '@/services/metrika-goals';
trackNewGoal('test_value');
```

---

## 📞 Поддержка

Для вопросов по API и интеграции:
- Документация проекта: `/docs`
- Исходный код: `/src/services/metrika-goals.ts`
- Примеры использования: `/src/components/home/RegionsMapSection.tsx`

---

**Версия API**: 2.0  
**Последнее обновление**: 28 декабря 2024  
**Статус**: ✅ Production Ready
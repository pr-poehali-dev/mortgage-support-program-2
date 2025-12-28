declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA4Events = {
  APPLICATION_SENT: 'application_sent',
  PHONE_CLICK: 'phone_click',
  TELEGRAM_CLICK: 'telegram_click',
  CALCULATOR_USED: 'calculator_used',
  QUIZ_COMPLETED: 'quiz_completed',
  PROGRAM_VIEWED: 'program_viewed',
  TAB_CHANGED: 'tab_changed',
  CITY_SELECTED: 'city_selected',
  FORM_SUBMITTED: 'form_submitted',
  SEARCH_USED: 'search_used',
  FILTER_CHANGED: 'filter_changed',
  MAP_INTERACTION: 'map_interaction',
} as const;

export function sendEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    try {
      window.gtag('event', eventName, params);
      console.log(`GA4 event: ${eventName}`, params);
    } catch (error) {
      console.error('GA4 event error:', error);
    }
  }
}

export function gaTrackApplicationSent(programType: string, amount?: number) {
  sendEvent(GA4Events.APPLICATION_SENT, {
    program_type: programType,
    value: amount || 0,
    currency: 'RUB',
  });
}

export function gaTrackPhoneClick(source: string = 'header') {
  sendEvent(GA4Events.PHONE_CLICK, {
    source: source,
  });
}

export function gaTrackTelegramClick() {
  sendEvent(GA4Events.TELEGRAM_CLICK);
}

export function gaTrackCalculatorUsed(amount: number, term: number, rate: number) {
  sendEvent(GA4Events.CALCULATOR_USED, {
    loan_amount: amount,
    loan_term: term,
    interest_rate: rate,
    monthly_payment: Math.round((amount * (rate / 100 / 12)) / (1 - Math.pow(1 + rate / 100 / 12, -term))),
  });
}

export function gaTrackQuizCompleted(result: string) {
  sendEvent(GA4Events.QUIZ_COMPLETED, {
    quiz_result: result,
  });
}

export function gaTrackProgramViewed(programName: string) {
  sendEvent(GA4Events.PROGRAM_VIEWED, {
    program_name: programName,
  });
}

export function gaTrackTabChanged(tabName: string) {
  sendEvent(GA4Events.TAB_CHANGED, {
    tab_name: tabName,
  });
}

export function gaTrackCitySelected(cityName: string) {
  sendEvent(GA4Events.CITY_SELECTED, {
    city_name: cityName,
  });
}

export function gaTrackFormSubmitted(city: string, source: string) {
  sendEvent(GA4Events.FORM_SUBMITTED, {
    city: city,
    form_source: source,
  });
}

export function gaTrackMapInteraction(action: string) {
  sendEvent(GA4Events.MAP_INTERACTION, {
    interaction_type: action,
  });
}

export function gaTrackSearchUsed(query: string) {
  sendEvent(GA4Events.SEARCH_USED, {
    search_term: query.substring(0, 50),
  });
}

export function gaTrackFilterChanged(filterType: string, count: number) {
  sendEvent(GA4Events.FILTER_CHANGED, {
    filter_type: filterType,
    result_count: count,
  });
}

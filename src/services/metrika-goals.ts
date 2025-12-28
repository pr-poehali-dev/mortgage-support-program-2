declare global {
  interface Window {
    ym?: (...args: any[]) => void;
  }
}

const METRIKA_ID = 105974763;

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

export function reachGoal(goal: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.ym) {
    try {
      window.ym(METRIKA_ID, 'reachGoal', goal, params);
      console.log(`Metrika goal: ${goal}`, params);
    } catch (error) {
      console.error('Metrika goal error:', error);
    }
  }
}

export function trackApplicationSent(programType: string, amount?: number) {
  reachGoal(MetrikaGoals.APPLICATION_SENT, {
    program: programType,
    amount: amount,
  });
}

export function trackPhoneClick(source: string = 'header') {
  reachGoal(MetrikaGoals.PHONE_CLICK, {
    source: source,
  });
}

export function trackTelegramClick() {
  reachGoal(MetrikaGoals.TELEGRAM_CLICK);
}

export function trackCalculatorUsed(amount: number, term: number, rate: number) {
  reachGoal(MetrikaGoals.CALCULATOR_USED, {
    amount: amount,
    term: term,
    rate: rate,
  });
}

export function trackQuizCompleted(result: string) {
  reachGoal(MetrikaGoals.QUIZ_COMPLETED, {
    result: result,
  });
}

export function trackProgramViewed(programName: string) {
  reachGoal(MetrikaGoals.PROGRAM_VIEWED, {
    program: programName,
  });
}

export function trackExcelDownload(reportType: string) {
  reachGoal(MetrikaGoals.EXCEL_DOWNLOAD, {
    type: reportType,
  });
}

export function trackEmailReport(email: string) {
  reachGoal(MetrikaGoals.EMAIL_REPORT, {
    email: email.replace(/(.{3}).*(@.*)/, '$1***$2'),
  });
}

export function trackTabChanged(tabName: string) {
  reachGoal(MetrikaGoals.TAB_CHANGED, {
    tab: tabName,
  });
}

export function trackCitySelected(cityName: string) {
  reachGoal(MetrikaGoals.CITY_SELECTED, {
    city: cityName,
  });
}

export function trackFormSubmitted(city: string, source: string) {
  reachGoal(MetrikaGoals.FORM_SUBMITTED, {
    city: city,
    source: source,
  });
}

export function trackMapInteraction(action: string) {
  reachGoal(MetrikaGoals.MAP_INTERACTION, {
    action: action,
  });
}

export function trackSearchUsed(query: string) {
  reachGoal(MetrikaGoals.SEARCH_USED, {
    query: query.substring(0, 50),
  });
}

export function trackFilterChanged(filterType: string, count: number) {
  reachGoal(MetrikaGoals.FILTER_CHANGED, {
    filter: filterType,
    results: count,
  });
}
import * as YM from './metrika-goals';
import * as GA from './ga4-events';

export function trackApplicationSent(programType: string, amount?: number) {
  YM.trackApplicationSent(programType, amount);
  GA.gaTrackApplicationSent(programType, amount);
}

export function trackPhoneClick(source: string = 'header') {
  YM.trackPhoneClick(source);
  GA.gaTrackPhoneClick(source);
}

export function trackTelegramClick() {
  YM.trackTelegramClick();
  GA.gaTrackTelegramClick();
}

export function trackCalculatorUsed(amount: number, term: number, rate: number) {
  YM.trackCalculatorUsed(amount, term, rate);
  GA.gaTrackCalculatorUsed(amount, term, rate);
}

export function trackQuizCompleted(result: string) {
  YM.trackQuizCompleted(result);
  GA.gaTrackQuizCompleted(result);
}

export function trackProgramViewed(programName: string) {
  YM.trackProgramViewed(programName);
  GA.gaTrackProgramViewed(programName);
}

export function trackTabChanged(tabName: string) {
  YM.trackTabChanged(tabName);
  GA.gaTrackTabChanged(tabName);
}

export function trackCitySelected(cityName: string) {
  YM.trackCitySelected(cityName);
  GA.gaTrackCitySelected(cityName);
}

export function trackFormSubmitted(city: string, source: string) {
  YM.trackFormSubmitted(city, source);
  GA.gaTrackFormSubmitted(city, source);
}

export function trackMapInteraction(action: string) {
  YM.trackMapInteraction(action);
  GA.gaTrackMapInteraction(action);
}

export function trackSearchUsed(query: string) {
  YM.trackSearchUsed(query);
  GA.gaTrackSearchUsed(query);
}

export function trackFilterChanged(filterType: string, count: number) {
  YM.trackFilterChanged(filterType, count);
  GA.gaTrackFilterChanged(filterType, count);
}

export function trackExcelDownload(reportType: string) {
  YM.trackExcelDownload(reportType);
  GA.sendEvent('excel_download', { report_type: reportType });
}

export function trackEmailReport(email: string) {
  YM.trackEmailReport(email);
  GA.sendEvent('email_report', { 
    email: email.replace(/(.{3}).*(@.*)/, '$1***$2') 
  });
}

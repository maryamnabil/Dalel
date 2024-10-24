import { Weekdays, WeekdaysLocalizationKeys } from '../enums/weekdays.enum';

export function isValidResponse(res: any): boolean {
  return res.statusCode === 200;
}

export function getWeekdayKey(weekday: Weekdays): string {
  switch (weekday) {
    case Weekdays.Sunday:
      return WeekdaysLocalizationKeys.SUNDAY;
    case Weekdays.Monday:
      return WeekdaysLocalizationKeys.MONDAY;
    case Weekdays.Tuesday:
      return WeekdaysLocalizationKeys.TUESDAY;
    case Weekdays.Wednesday:
      return WeekdaysLocalizationKeys.WEDNESDAY;
    case Weekdays.Thursday:
      return WeekdaysLocalizationKeys.THURSDAY;
    case Weekdays.Friday:
      return WeekdaysLocalizationKeys.FRIDAY;
    case Weekdays.Saturday:
      return WeekdaysLocalizationKeys.SATURDAY;
    default:
      throw new Error('Invalid weekday');
  }
}

export function getMapLink(latitude: number, longitude: number): string {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

export function getFileName(filePath: string) {
  const parts = filePath?.split('/');
  const attachmentName = parts[parts.length - 1];
  return attachmentName;
}

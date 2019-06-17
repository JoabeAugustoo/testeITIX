export declare class DateUtils {
  constructor();
  /**
   * Converte uma data do tipo Date para uma string do tipo dd/mm/yyyy.
   *
   * @param date data
   */
  dateToString(date: Date, separator?: string): string;
  dateToStringBackend(date: Date): string;
}

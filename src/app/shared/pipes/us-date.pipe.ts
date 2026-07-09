import { Pipe, PipeTransform } from '@angular/core';
import { formatUsDate } from '../utils/date.util';

/**
 * Formats an ISO (yyyy-MM-dd) date string as MM/DD/YYYY.
 * @example {{ book.dateStarted | usDate }}
 */
@Pipe({ name: 'usDate' })
export class UsDatePipe implements PipeTransform {
  /**
   * @description Transforms an ISO date string into US MM/DD/YYYY display format.
   * @param isoDate - The ISO date string to format, or null.
   * @returns {string} The formatted date, or an empty string when isoDate is null/invalid.
   */
  transform(isoDate: string | null): string {
    return formatUsDate(isoDate);
  }
}

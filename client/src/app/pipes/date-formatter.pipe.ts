import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormatter',
  standalone: false,
})
export class DateFormatterPipe implements PipeTransform {
  transform(value: string): string {
    const date = new Date(value);

    // Define month names
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Extract parts
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Determine day suffix (st, nd, rd, th)
    const suffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };

    return `${month} ${day}${suffix(day)}, ${year}`;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'format'
})
export class PhoneNumberFormatPipePipe implements PipeTransform {
  transform(value: any, format: string): string {
    if (!value || value.length === 0 || format == '')
      return value;

    let numPosition: string[] = [];
    for (let i = 0; i < format.length; i++)
      if (format[i] === '#')
        numPosition.push(i.toString());

    if (numPosition.length !== value.length)
      return value;

    let str = Array.from(format);
    for (let i = 0; i < numPosition.length; i++)
      str[+numPosition[i]] = value[i];

    return str.join('');
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dotSeparator'
})
export class DotSeparatorPipe implements PipeTransform {
  transform(value: number): string {
    const stringValue = String(value);
    const parts = stringValue.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join('.');
  }
}


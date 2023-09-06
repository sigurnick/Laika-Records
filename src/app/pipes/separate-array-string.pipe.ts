import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'separateArrayString'
})
export class SeparateArrayStringPipe implements PipeTransform {


  transform(value: string[], args?: any): any {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value;
  }


}

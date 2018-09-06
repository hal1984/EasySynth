import { Pipe, PipeTransform } from '@angular/core';
import { round  as _round } from 'lodash';

@Pipe({
  name: 'round'
})
export class RoundPipe implements PipeTransform {

  transform(value: number, precision: number = 0): number {
    return _round(value, precision);
  }

}

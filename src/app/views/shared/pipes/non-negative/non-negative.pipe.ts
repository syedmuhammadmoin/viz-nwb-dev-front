import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nonNegative'
})
export class NonNegativePipe implements PipeTransform {

  transform(value: number): number {
    if(value < 0) { value = 0 }
    return value
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'generator2'
})
export class Generator2Pipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return null;
  }

}

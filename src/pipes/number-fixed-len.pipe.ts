//
// Author: Kevin Moyse
//
import {Pipe, PipeTransform} from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 |  exponentialStrength:10}}
 *   formats to: 1024
*/
@Pipe({name: 'numberFixedLen'})
export class NumberFixedLenPipe implements PipeTransform {
  transform(value: number, len: number): string {
    let num = '' + value;
    while (num.length < len) {
      num = '0' + num;
    }
    return num;
  }
}

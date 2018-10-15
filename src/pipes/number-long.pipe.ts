//
// Author: Kevin Moyse
//
import {Pipe, PipeTransform} from '@angular/core';

/*
 * Transforms an bson number long object to number.
 * Usage:
 *   amount | amount:factor
 * Example:
 *   {{ {"$numberLong":"1480091402085"} |  numberLong}}
 *   formats to: 1480091402085
*/
@Pipe({name: 'numberLong'})
export class NumberLongPipe implements PipeTransform {
  transform(value: any): number {

    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'object') {
      if (typeof value.$numberLong !== 'undefined') {
        return value.$numberLong;
      }
    }
    console.warn('NumberLongPipe::transform(' + JSON.stringify(value) + ') unrecognized');
    return value;
  }
}

//
// Author: Kevin Moyse
//
import {Pipe, PipeTransform} from '@angular/core';

/*
 * Gets _id.$oid from a mongodb JSon
 * Usage:
 *   obj | objectId
 * Example:
 *   {{ {"_id" : ObjectId("59566f9c8ec6d954dba5ed53")} |  objectId}}
 *   formats to: 59566f9c8ec6d954dba5ed53
*/
@Pipe({name: 'objectId'})
export class ObjectIdPipe implements PipeTransform {
  transform(value: any): string {
    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'object') {
      if (typeof value._id !== 'undefined') {
        return value._id.$oid;
      }
    }
    console.warn('ObjectIdPipe::transform(' + JSON.stringify(value) + ') unrecognized');
    return value;
  }
}

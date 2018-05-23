//
// Author: Kevin Moyse
//
//import { Response } from '@angular/http';
import {HttpErrorResponse} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import 'rxjs/add/observable/throw';

import {Error} from './error';

export class ServiceUtils {

  //    public static extractData(res: Response): any {
  //        try {
  //            return res.json();
  //        } catch (e) {
  //            // This happens when the body of the response is not JSON (or actually empty)
  //            console.error("ServiceUtils::extractData(" + res + ")|" + e);
  //            return null;
  //        }
  //    }


  /**
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  public static handleError6<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  //| Response 
  public static handleError(response: HttpErrorResponse | any): Observable<Error> | Observable<any> {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    //        if (response instanceof Response) {
    //            try {
    //                let body = response.json();
    //                let error: Error = Error.build(body.errorCode || -1, body.errorReason);
    //                var data = new Object();
    //                for (var k in body) {
    //                    if ((k !== 'errorCode') && (k !== 'errorReason'))
    //                        data[k] = body[k];
    //                }
    //                error.setData(data);
    //                return Observable.throw(error);
    //            }
    //            catch (e) {
    //                console.error("ServiceUtils::handleError|" + e);
    //            }
    //            //            response.message ||
    //            const err = JSON.stringify(response);
    //            errMsg = `${response.status} - ${response.statusText || ''} ${err}`;
    //        }
    if (response instanceof HttpErrorResponse) {
      try {
        const err = response.error instanceof Object ? response.error : JSON.parse(response.error);
        const error: Error = Error.build(err.errorCode || -1, err.errorReason);
        var data = new Object();
        for (var k in err) {
          if ((k !== 'errorCode') && (k !== 'errorReason'))
            data[k] = err[k];
        }
        error.setData(data);
        return Observable.throw(error);
      }
      catch (e) {
        console.error("ServiceUtils::handleError|" + e);
      }
      //            response.message ||
      const err = JSON.stringify(response);
      errMsg = `${response.status} - ${response.statusText || ''} ${err}`;
    }
    else {
      errMsg = response.message ? response.message : response.toString();
    }
    console.error("ServiceUtils::handleError|" + errMsg);
    return Observable.throw(errMsg);
  }

}

//
// Author: Kevin Moyse
//
import {HttpErrorResponse} from '@angular/common/http';

import {Observable} from 'rxjs';
import {of} from 'rxjs';
import {throwError} from 'rxjs';

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

            if (error instanceof HttpErrorResponse) {
                const errObj = error.error instanceof Object ? error.error : JSON.parse(error.error);
                const err: Error = Error.build(errObj.errorCode || -1, errObj.errorReason || null);
                var data = new Object();
                for (var k in errObj) {
                    if ((k !== 'errorCode') && (k !== 'errorReason'))
                        data[k] = errObj[k];
                }
                err.setData(data);
                return throwError(err);
            }

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }

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
                const errObj = response.error instanceof Object ? response.error : JSON.parse(response.error);
                const error: Error = Error.build(errObj.errorCode || -1, errObj.errorReason);
                let data = new Object();
                for (let k in errObj) {
                    if ((k !== 'errorCode') && (k !== 'errorReason')) {
                        data[k] = errObj[k];
                    }
                }
                error.setData(data);
                return throwError(error);
            } catch (e) {
                console.error('ServiceUtils::handleError|' + e);
            }
            //            response.message ||
            const err = JSON.stringify(response);
            errMsg = `${response.status} - ${response.statusText || ''} ${err}`;
        } else {
            errMsg = response.message ? response.message : response.toString();
        }
        console.error('ServiceUtils::handleError|' + errMsg);
        return throwError(errMsg);
    }

}

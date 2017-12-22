//
// Author: Kevin Moyse
//
//import { Response } from '@angular/http';
import { HttpErrorResponse  } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { Error } from './error';

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
                let err = response.error;
                let error: Error = Error.build(err.errorCode || -1, err.errorReason);
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

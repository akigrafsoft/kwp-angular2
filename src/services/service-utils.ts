//
// Author: Kevin Moyse
//
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { Error } from './error';

export class ServiceUtils {

    public static extractData(res: Response): any {
        try {
            return res.json();
        } catch (e) {
            // This happens when the body of the response is not JSON (or actually empty)
            //console.error("ServiceUtils::extractData(" + res + ")|" + e);
            return null;
        }
    }

    public static handleError(response: Response | any): Observable<Error> | Observable<any> {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (response instanceof Response) {
            try {
                let body = response.json();
                let error: Error = Error.build(body.errorCode || -1, body.errorReason);
                var data = new Object();
                for (var k in body) {
                    if ((k !== 'errorCode') && (k !== 'errorReason'))
                        data[k] = body[k];
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
        } else {
            errMsg = response.message ? response.message : response.toString();
        }
        console.error("ServiceUtils::handleError|" + errMsg);
        return Observable.throw(errMsg);
    }

}

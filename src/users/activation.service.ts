//
// Author: Kevin Moyse
//
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ActivationService {

    constructor(private http: Http, private baseUrl: string) { }

    activate(key) {
        let headers = new Headers({
            //'SessionId': this.auth.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + key), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('ActivationService::handleError: An error occurred', error);
        return Promise.reject(error.message || error);
    }

}
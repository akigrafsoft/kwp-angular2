//
// Author: Kevin Moyse
//
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { AuthService } from '../auth/auth.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class JnlpService {

    // default value
    // private DefaubaseUrl = 'jnlp';

    constructor(private http: Http, private auth: AuthService, private baseUrl: string) {
        if (typeof this.baseUrl === 'undefined') {
            console.debug('JnlpService.baseUrl using default');
            this.baseUrl = 'jnlp';
        }
    }

    run(id: string) {
        let headers = new Headers({
            'SessionId': this.auth.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + id), { headers: headers })
            .toPromise()
            .then()
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
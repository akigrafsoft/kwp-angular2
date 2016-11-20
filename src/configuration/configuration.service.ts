//
// Author: Kevin Moyse
//
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ConfigurationService {

    constructor(private http: Http, private baseUrl: string) { }

    getConfiguration(sessionId: string) {

        let headers = new Headers({
            'SessionId': sessionId
        });

        return this.http.get(encodeURI(this.baseUrl), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}

//
// Author: Kevin Moyse
//
import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ConfigurationService {

    constructor(private http: Http, @Inject("baseUrl") private baseUrl: string) { }

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
        console.error('ConfigurationService::An error occurred', error);
        return Promise.reject(error.message || error);
    }

}

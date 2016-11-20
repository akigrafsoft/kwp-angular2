//
// Author: Kevin Moyse
//
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { AuthService } from '../auth/auth.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class FileService {

    private baseUrl = 'updwnld';  // URL to web api

    constructor(private http: Http, private auth: AuthService) { }

    getFile(filename: string) {

        let headers = new Headers({
            'SessionId': this.auth.sessionId
        });

        return this.http.get(encodeURI(this.baseUrl + '/' + filename), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}

//
// Author: Kevin Moyse
//
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService } from '../auth/auth.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class FileService {

    private default_baseUrl = 'updwnld';  // URL to web api

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        @Inject("baseUrl") private baseUrl: string) {
        if (typeof this.baseUrl === 'undefined') {
            console.warn('FileService.baseUrl using default<' + this.default_baseUrl + '>');
            this.baseUrl = this.default_baseUrl;
        }
    }

    getFile(filename: string) {
        let headers = new HttpHeaders({
            'SessionId': this.authService.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + filename), { headers: headers })
            .toPromise()
            .then()
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}

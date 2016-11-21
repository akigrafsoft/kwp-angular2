//
// Author: Kevin Moyse
//
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { AuthService } from '../auth/auth.service';
import { User } from './user';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class UserService {

    constructor(private http: Http, private auth: AuthService, private baseUrl: string) { }

    create(user: User) {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });
        return this.http.post(encodeURI(this.baseUrl + '/' + user.username), JSON.stringify(user), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    getUser(username: string) {
        let headers = new Headers({
            'SessionId': this.auth.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + username), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    update(user: User) {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + user.username), JSON.stringify(user), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    del(username: string) {
        let headers = new Headers({
            'SessionId': this.auth.sessionId
        });
        return this.http.delete(encodeURI(this.baseUrl + '/' + username), { headers: headers })
            .toPromise()
            .then()
            .catch(this.handleError);
    }

    private handleError(error: any) {
        //let content = error.json();
        console.error('UserService::handleError: An error occurred', error);
        //this.auth.handleStatus(content);
        //console.error('An error occurred', response);
        return Promise.reject(error.message || error);
    }

}
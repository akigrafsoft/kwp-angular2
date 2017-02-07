//
// Author: Kevin Moyse
//
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

//import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ServiceUtils } from '../services/service-utils';
import { AuthService } from '../auth/auth.service';
import { User } from './user';

@Injectable()
export class UserService {

    constructor(private http: Http, private authService: AuthService, private baseUrl: string) { }

    create(user: User) {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.post(encodeURI(this.baseUrl), JSON.stringify(user), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
        //            .toPromise()
        //            .then(res => res.json())
        //            .catch(this.handleError);
    }

    getUser(username: string) {
        let headers = new Headers({
            'SessionId': this.authService.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + username), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    update(user: User) {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + user.id), JSON.stringify(user), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    del(id: string) {
        let headers = new Headers({
            'SessionId': this.authService.sessionId
        });
        return this.http.delete(encodeURI(this.baseUrl + '/' + id), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
        //            .toPromise()
        //            .then()
        //            .catch(this.handleError);
    }

    //    private handleError(error: any) {
    //        //let content = error.json();
    //        console.error('UserService::handleError: An error occurred', error);
    //        //this.auth.handleStatus(content);
    //        //console.error('An error occurred', response);
    //        return Promise.reject(error.message || error);
    //    }

}
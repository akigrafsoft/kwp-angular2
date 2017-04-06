//
// Author: Kevin Moyse
//
import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ServiceUtils } from '../services/service-utils';
import { Error } from '../services/error';
//import { User } from './user';

@Injectable()
export class ActivationService {

    constructor(private http: Http, @Inject("baseUrl") private baseUrl: string) { }

    activate(key): Observable<any | Error> {
        let headers = new Headers();
        return this.http.get(encodeURI(this.baseUrl + '/' + key), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                return ServiceUtils.handleError(response);
            });
    }

}
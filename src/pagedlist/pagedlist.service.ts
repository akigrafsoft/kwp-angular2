//
// Author: Kevin Moyse
//
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { AuthService } from '../auth/auth.service';
import { ServiceUtils } from '../services/service-utils';
import { Error } from '../services/error';

//import 'rxjs/add/operator/toPromise';

@Injectable()
export class PagedListService {

    constructor(private http: HttpClient, private authService: AuthService,
        @Inject("baseUrl") private baseUrl: string) { }

    createList(factory: string, factoryParams: Object,
        listId: string, searchCriteriasBase: Object, searchCriterias: Object,
        sortCriteria: string, reverse: boolean, fromIndex: number, pageSize: number): Observable<any | Error> {

        let request = {
            "factory": factory,
            "factoryParams": factoryParams,
            "searchCriteriasBase": searchCriteriasBase,
            "searchCriterias": searchCriterias,
            "sortCriteria": sortCriteria,
            "reverse": reverse,
            "fromIndex": fromIndex,
            "pageSize": pageSize
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.post(this.baseUrl + '/' + listId, JSON.stringify(request), { headers: headers })
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    refreshList(listId) {
        //console.log("PagedListService::refreshList()");
        let request = {};
        let headers = new HttpHeaders({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.post(this.baseUrl + '/' + listId, JSON.stringify(request), { headers: headers })
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    searchList(listId, searchCriterias,
        sortCriteria, reverse, fromIndex, pageSize) {
        let request = {
            "searchCriterias": searchCriterias,
            "sortCriteria": sortCriteria,
            "reverse": reverse,
            "fromIndex": fromIndex,
            "pageSize": pageSize
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + listId), JSON.stringify(request), { headers: headers })
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    sortList(listId, sortCriteria, reverse, fromIndex,
        pageSize) {
        let request = {
            "sortCriteria": sortCriteria,
            "reverse": reverse,
            "fromIndex": fromIndex,
            "pageSize": pageSize
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + listId), JSON.stringify(request), { headers: headers })
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    getPage(listId, fromIndex, pageSize) {
        let headers = new HttpHeaders({
            'SessionId': this.authService.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + listId + '/' + fromIndex + '/' + pageSize), { headers: headers })
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

}

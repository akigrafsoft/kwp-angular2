//
// Author: Kevin Moyse
//
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { AuthService } from '../auth/auth.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class PagedListService {

    constructor(private http: Http, private auth: AuthService, private baseUrl: string) { }

    createList(listFactory, listFactoryParams,
        listId, searchCriteriasBase, searchCriterias,
        sortCriteria, reverse, fromIndex, pageSize) {

        let request = {
            "listFactory": listFactory,
            "listFactoryParams": listFactoryParams,
            "searchCriteriasBase": searchCriteriasBase,
            "searchCriterias": searchCriterias,
            "sortCriteria": sortCriteria,
            "reverse": reverse,
            "fromIndex": fromIndex,
            "pageSize": pageSize
        };
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });
        return this.http.post(this.baseUrl + '/' + listId, JSON.stringify(request), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    refreshList(listId) {
        //console.log("PagedListService::refreshList()");
        let request = {};
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });
        return this.http.post(this.baseUrl + '/' + listId, JSON.stringify(request), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
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
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + listId), JSON.stringify(request), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    sortList(listId, sortCriteria, reverse, fromIndex,
        pageSize) {
        let request = {
            "sortCriteria": sortCriteria,
            "reverse": reverse,
            "fromIndex": fromIndex,
            "pageSize": pageSize
        };
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + listId), JSON.stringify(request), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    getPage(listId, fromIndex, pageSize) {
        let headers = new Headers({
            'SessionId': this.auth.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + listId + '/' + fromIndex + '/' + pageSize), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}

//
// Author: Kevin Moyse
//
import { Injectable, Inject } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

import { AuthService } from '../auth/auth.service';
import { ServiceUtils } from '../services/service-utils';
import { Error } from '../services/error';

@Injectable()
export class MongoDBService {

    //private baseUrl = 'mongodb';

    constructor(private http: Http, private auth: AuthService,
        @Inject("baseUrl") private baseUrl: string) { }

    // if id is provided null, then mongodb will create its own
    addDocument(collection: string, id: string, document: any): Observable<any | Error> {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });

        let uri = this.baseUrl + '/' + collection;
        if (id != null) {
            uri += '/' + id;
        }
        return this.http.post(encodeURI(uri),
            JSON.stringify(document), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.auth.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
        //            .toPromise()
        //            .then(res => res.json())
        //            .catch(this.handleError);
    }

    deleteDocument(collection: string, id: string): Observable<any | Error> {
        let headers = new Headers({
            'SessionId': this.auth.sessionId
        });
        return this.http.delete(encodeURI(this.baseUrl + '/' + collection + '/' + id), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.auth.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    getDistinctDocuments(collection: string, field: string): Observable<any | Error> {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + collection),
            JSON.stringify({
                'distinct': field
            }), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.auth.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    getDocument(collection: string, id: string): Observable<any | Error> {
        let headers = new Headers({
            'SessionId': this.auth.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + collection + '/' + id), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.auth.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    getDocuments(collection: string, queryDocument: any): Observable<any | Error> {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + collection),
            JSON.stringify({
                'query': queryDocument
            }), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.auth.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    //    match: any, group: any
    getAggregation(collection: string, agg: any[]): Observable<any | Error> {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });
        //        { 'match': match, 'group': group }
        return this.http.put(encodeURI(this.baseUrl + '/' + collection),
            JSON.stringify({
                'aggregate': agg
            }), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.auth.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    getDocumentsSorted(collection: string, queryDocument: any, sortDocument: any): Observable<any | Error> {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + collection),
            JSON.stringify({
                'query': queryDocument,
                'sort': sortDocument
            }), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.auth.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    updateDocument(collection: string, id: string, updateDocument: any): Observable<any | Error> {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + collection + '/' + id),
            JSON.stringify(updateDocument), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.auth.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }
}
//
// Author: Kevin Moyse
//
import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { AuthService } from '../auth/auth.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class MongoDBService {

    //private baseUrl = 'mongodb';

    constructor(private http: Http, private auth: AuthService, private baseUrl: string) { }

    // if id is provided null, then mongodb will create its own
    addDocument(collection: string, id: string, document: any) {
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
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    deleteDocument(collection: string, id: string) {
        let headers = new Headers({
            'SessionId': this.auth.sessionId
        });
        return this.http.delete(encodeURI(this.baseUrl + '/' + collection + '/' + id), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    getDistinctDocuments(collection: string, field: string) {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + collection),
            JSON.stringify({
                'distinct': field
            }), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    getDocument(collection: string, id: string) {
        let headers = new Headers({
            'SessionId': this.auth.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + collection + '/' + id), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    getDocuments(collection: string, queryDocument: any) {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + collection),
            JSON.stringify({
                'query': queryDocument
            }), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    getDocumentsSorted(collection: string, queryDocument: any, sortDocument: any) {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + collection),
            JSON.stringify({
                'query': queryDocument,
                'sort': sortDocument
            }), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    updateDocument(collection: string, id: string, updateDocument: any) {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });
        return this.http.put(encodeURI(this.baseUrl + '/' + collection + '/' + id),
            JSON.stringify(updateDocument), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
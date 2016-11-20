//
// Author: Kevin Moyse
//
import { Injectable } from '@angular/core';
import { Headers, Http, ResponseContentType } from '@angular/http';

import { AuthService } from '../auth/auth.service';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class MongoDBGridFSService {

    //private baseUrl = 'mongodbgridfs';

    constructor(private http: Http, private auth: AuthService, private baseUrl: string) { }

    getFile(bucket: string, id: string, responseType: ResponseContentType) {
        let headers = new Headers({
            'SessionId': this.auth.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + bucket + '/' + id), { headers: headers, responseType: responseType })
            .toPromise()
            .then()
            .catch(this.handleError);
    }

    getMetadata(bucket: string, id: string) {
        let headers = new Headers({
            'SessionId': this.auth.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + bucket + '/' + id + '/metadata'), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    addFile(bucket: string, fromfile: string, filename: string, metadata: any) {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.auth.sessionId
        });

        let document = {
            'fromfile': fromfile,
            'filename': filename,
            'metadata': metadata
        };

        return this.http.post(encodeURI(this.baseUrl + '/' + bucket),
            JSON.stringify(document), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    deleteFile(bucket: string, id: string) {
        let headers = new Headers({
            'SessionId': this.auth.sessionId
        });
        return this.http.delete(encodeURI(this.baseUrl + '/' + bucket + '/' + id), { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
//
// Author: Kevin Moyse
//
import { Injectable, Inject } from '@angular/core';
import { Headers, Http, ResponseContentType } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
//import 'rxjs/add/operator/toPromise';

import { AuthService } from '../auth/auth.service';
import { ServiceUtils } from '../services/service-utils';

@Injectable()
export class MongoDBGridFSService {

    //private baseUrl = 'mongodbgridfs';

    constructor(private http: Http, private auth: AuthService,
        @Inject("baseUrl") private baseUrl: string) { }

    getFile(bucket: string, id: string, responseType: ResponseContentType): Observable<any> {
        let headers = new Headers({
            'SessionId': this.auth.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + bucket + '/' + id), { headers: headers, responseType: responseType })
            .catch(response => {
                this.auth.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
        //            .toPromise()
        //            .then()
        //            .catch(error => {
        //                console.error('An error occurred', error);
        //                return Promise.reject(error.message || error);
        //            });
    }

    getMetadata(bucket: string, id: string): Observable<any> {
        let headers = new Headers({
            'SessionId': this.auth.sessionId
        });
        //        return this.http.get(encodeURI(this.baseUrl + '/' + bucket + '/' + id + '/metadata'), { headers: headers })
        //            .toPromise()
        //            .then(res => res.json())
        //      .catch(this.handleError);

        return this.http.get(encodeURI(this.baseUrl + '/' + bucket + '/' + id + '/metadata'), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.auth.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }


    addFile(bucket: string, fromfile: string, filename: string, metadata: any): Observable<any> {
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
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.auth.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
        //            .toPromise()
        //            .then(res => res.json())
        //            .catch(this.handleError);
    }

    deleteFile(bucket: string, id: string): Observable<any> {
        let headers = new Headers({
            'SessionId': this.auth.sessionId
        });
        return this.http.delete(encodeURI(this.baseUrl + '/' + bucket + '/' + id), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.auth.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
        //            .toPromise()
        //            .then(res => res.json())
        //            .catch(this.handleError);
    }

    //    private handleError(error: any) {
    //        console.error('An error occurred', error);
    //        return Promise.reject(error.message || error);
    //    }
}
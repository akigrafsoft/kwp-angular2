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
import { Error } from '../services/error';

@Injectable()
export class MongoDBGridFSService {

    //private baseUrl = 'mongodbgridfs';

    constructor(private http: Http, private authService: AuthService,
        @Inject("baseUrl") private baseUrl: string) { }

    getFile(bucket: string, id: string, responseType: ResponseContentType): Observable<any> {
        let headers = new Headers({
            'SessionId': this.authService.sessionId
        });
        return this.http.get(encodeURI(this.baseUrl + '/' + bucket + '/' + id), { headers: headers, responseType: responseType })
            .catch(response => {
                this.authService.handleErrorResponse(response);
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
            'SessionId': this.authService.sessionId
        });
        //        return this.http.get(encodeURI(this.baseUrl + '/' + bucket + '/' + id + '/metadata'), { headers: headers })
        //            .toPromise()
        //            .then(res => res.json())
        //      .catch(this.handleError);

        return this.http.get(encodeURI(this.baseUrl + '/' + bucket + '/' + id + '/metadata'), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    // TODO : test this
    uploadFile(bucket: string, file: File, metadata: any): Observable<any> {
        return Observable.create(observer => {
            let formData: FormData = new FormData(),
                xhr: XMLHttpRequest = new XMLHttpRequest();

            // for (let i = 0; i < files.length; i++) {
            //https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
            //formData.append("metadata[]", JSON.stringify(metadatas[i]));
            //formData.append("files[]", files[i], files[i].name);
            //}

            formData.append("metadata", JSON.stringify(metadata));
            formData.append("file", file, file.name);

            xhr.onreadystatechange = () => {
                console.debug('MongoDBGridFSService::uploadFile onreadystatechange=' + xhr.readyState);
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if (xhr.status === 200) {
                        observer.next(JSON.parse(xhr.responseText));
                        observer.complete();
                    }
                    else if (xhr.status == 403) {
                        var body = JSON.parse(xhr.responseText);
                        observer.error(Error.build(body.errorCode || -1, body.errorReason));
                    }
                    else {
                        observer.error(Error.build(xhr.status, "HTTP error"));
                    }
                }
            };

            xhr.upload.onprogress = (event) => {
                var progress = Math.round(event.loaded / event.total * 100);
                console.debug('MongoDBGridFSService::uploadFile progress=' + progress);
                //this.progressObserver.next(this.progress);
            };

            xhr.open('POST', encodeURI(this.baseUrl + '/' + bucket), true);
            xhr.setRequestHeader('SessionId', this.authService.sessionId);
            xhr.send(formData);
        });
    }

    addFile(bucket: string, fromfile: string, filename: string, metadata: any): Observable<any> {
        let headers = new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
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
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

    deleteFile(bucket: string, id: string): Observable<any> {
        let headers = new Headers({
            'SessionId': this.authService.sessionId
        });
        return this.http.delete(encodeURI(this.baseUrl + '/' + bucket + '/' + id), { headers: headers })
            .map(ServiceUtils.extractData)
            .catch(response => {
                this.authService.handleErrorResponse(response);
                return ServiceUtils.handleError(response);
            });
    }

}
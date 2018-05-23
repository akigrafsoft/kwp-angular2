//
// Author: Kevin Moyse
//
import {Injectable, Inject} from '@angular/core';
//import { Headers, Http, ResponseContentType } from '@angular/http';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';

import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AuthService} from '../auth/auth.service';
import {ServiceUtils} from '../services/service-utils';
import {Error} from '../services/error';

@Injectable()
export class MongoDBGridFSService {

  constructor(private http: HttpClient,
    private authService: AuthService,
    @Inject("baseUrl") private baseUrl: string) {}

  getTextFile(bucket: string, id: string): Observable<any> {
    let headers = new HttpHeaders({
      'SessionId': this.authService.sessionId
    });
    return this.http.get(encodeURI(this.baseUrl + '/' + bucket + '/' + id), {headers: headers, responseType: 'text'})
      .pipe(catchError(ServiceUtils.handleError6('getTextFile', [])));
  }

  getFile(bucket: string, id: string, observe: any, responseType: any): Observable<any> {
    let headers = new HttpHeaders({
      'SessionId': this.authService.sessionId
    });
    return this.http.get(encodeURI(this.baseUrl + '/' + bucket + '/' + id), {headers: headers, observe: observe, responseType: responseType})
      .pipe(catchError(ServiceUtils.handleError6('getFile', [])));
  }

  getMetadata(bucket: string, id: string): Observable<any> {
    let headers = new HttpHeaders({
      'SessionId': this.authService.sessionId
    });

    return this.http.get(encodeURI(this.baseUrl + '/' + bucket + '/' + id + '/metadata'), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('getMetadata', [])));
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
    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'SessionId': this.authService.sessionId
    });

    let document = {
      'fromfile': fromfile,
      'filename': filename,
      'metadata': metadata
    };

    return this.http.post(encodeURI(this.baseUrl + '/' + bucket),
      JSON.stringify(document), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('addFile', [])));
  }

  deleteFile(bucket: string, id: string): Observable<any> {
    let headers = new HttpHeaders({
      'SessionId': this.authService.sessionId
    });
    return this.http.delete(encodeURI(this.baseUrl + '/' + bucket + '/' + id), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('deleteFile', [])));
    //            .catch((response: HttpErrorResponse) => {
    //                this.authService.handleErrorResponse(response);
    //                return ServiceUtils.handleError(response);
    //            });
  }

}
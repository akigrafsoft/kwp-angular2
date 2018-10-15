//
// Author: Kevin Moyse
//
import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {AuthService} from '../auth/auth.service';
import {ServiceUtils} from '../services/service-utils';

import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class FileService {

  private default_baseUrl = 'updwnld';  // URL to web api

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject('baseUrl') private baseUrl: string) {
    if (typeof this.baseUrl === 'undefined') {
      console.warn('FileService.baseUrl using default<' + this.default_baseUrl + '>');
      this.baseUrl = this.default_baseUrl;
    }
  }

  getFile(filename: string): Observable<any | Error> {
    let headers = new HttpHeaders({
      'SessionId': this.authService.sessionId
    });
    return this.http.get(encodeURI(this.baseUrl + '/' + filename), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('getFile', [])));
    //            .toPromise()
    //            .then()
    //            .catch(this.handleError);
  }

  //  private handleError(error: any) {
  //    console.error('An error occurred', error);
  //    return Promise.reject(error.message || error);
  //  }

}

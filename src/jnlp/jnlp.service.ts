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
export class JnlpService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    @Inject('baseUrl') private baseUrl: string) {
    if (typeof this.baseUrl === 'undefined') {
      console.warn('JnlpService.baseUrl using default');
      this.baseUrl = 'jnlp';
    }
  }

  run(id: string): Observable<any | Error> {
    let headers = new HttpHeaders({
      'SessionId': this.authService.sessionId
    });
    return this.http.get(encodeURI(this.baseUrl + '/' + id), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('getFile', [])));
  }
}

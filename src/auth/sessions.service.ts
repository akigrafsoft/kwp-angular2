//
// Author: Kevin Moyse
//
import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AuthService} from './auth.service';
import {ServiceUtils} from '../services/service-utils';

@Injectable()
export class SessionsService {

  constructor(private http: HttpClient,
    private authService: AuthService,
    @Inject('baseUrl') private baseUrl: string) {}

  public getSessions(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'SessionId': this.authService.sessionId
    });
    return this.http.get(this.baseUrl, {headers: headers}).pipe(catchError(ServiceUtils.handleError6('getHeroes', [])));
  }

  public getSession(sessionId: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'SessionId': this.authService.sessionId
    });
    return this.http.get(encodeURI(this.baseUrl + '/' + sessionId), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('getSession', [])));
    //   .catch(this.handleError);
  }

  public getSessionObject(key: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'SessionId': this.authService.sessionId
    });
    return this.http.get(encodeURI(this.baseUrl + '/session/' + key), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('getSessionObject', [])));
  }

  public destroySession(sessionId: string): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'SessionId': this.authService.sessionId
    });
    return this.http.delete(encodeURI(this.baseUrl + '/' + sessionId), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('destroySession', [])));
  }

  //  private handleError(error: HttpResponse<any> | any) {
  //    // In a real world app, we might use a remote logging infrastructure
  //    let errMsg: string;
  //    if (error instanceof HttpResponse) {
  //      let body;
  //      try {
  //        body = error;
  //      }
  //      catch (e) {
  //        body = '';
  //      }
  //
  //      const err = body.error || JSON.stringify(body);
  //      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
  //    } else {
  //      errMsg = error.message ? error.message : error.toString();
  //    }
  //    console.error("SessionsService::handleError|" + errMsg);
  //    return Observable.throw(errMsg + "(SessionsService)");
  //  }
}

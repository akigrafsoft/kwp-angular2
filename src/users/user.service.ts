//
// Author: Kevin Moyse
//
import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {ServiceUtils} from '../services/service-utils';
import {Error} from '../services/error';
import {AuthService} from '../auth/auth.service';
import {User} from './user';

@Injectable()
export class UserService {

  constructor(private http: HttpClient,
    private authService: AuthService,
    @Inject('baseUrl') private baseUrl: string) {}

  create(user: User): Observable<any | Error> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'SessionId': this.authService.sessionId
    });
    return this.http.post(encodeURI(this.baseUrl), JSON.stringify(user), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('tmpPassword', [])));
  }

  getUser(userIdOrName: string): Observable<any | Error> {
    let headers = new HttpHeaders({
      'SessionId': this.authService.sessionId
    });
    return this.http.get(encodeURI(this.baseUrl + '/' + userIdOrName), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('tmpPassword', [])));
  }

  update(user: User): Observable<any | Error> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'SessionId': this.authService.sessionId
    });
    return this.http.put(encodeURI(this.baseUrl + '/' + user.id), JSON.stringify(user), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('tmpPassword', [])));
  }

  del(id: string): Observable<any | Error> {
    let headers = new HttpHeaders({
      'SessionId': this.authService.sessionId
    });
    return this.http.delete(encodeURI(this.baseUrl + '/' + id), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('tmpPassword', [])));
  }
}

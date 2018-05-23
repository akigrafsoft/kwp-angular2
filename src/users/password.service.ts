//
// Author: Kevin Moyse
//
import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';

import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {ServiceUtils} from '../services/service-utils';
import {Error} from '../services/error';
import {AuthService} from '../auth/auth.service';
import {User} from './user';

@Injectable()
export class PasswordService {

  constructor(private http: HttpClient, private authService: AuthService,
    @Inject("baseUrl") private baseUrl: string) {}

  tmpPassword(username: string): Observable<any | Error> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'SessionId': this.authService.sessionId
    });
    return this.http.post(encodeURI(this.baseUrl + "/" + username), JSON.stringify({}), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('tmpPassword', [])));
    //            .catch((response: HttpErrorResponse) => {
    //                this.authService.handleErrorResponse(response);
    //                return ServiceUtils.handleError(response);
    //            });
  }

  changePassword(user: User, currentPassword: string, newPassword: string): Observable<any | Error> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'SessionId': this.authService.sessionId
    });
    return this.http.put(encodeURI(this.baseUrl + '/' + user.id), {cp: currentPassword, np: newPassword}, {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('changePassword', [])));
    //            .catch((response: HttpErrorResponse) => {
    //                this.authService.handleErrorResponse(response);
    //                return ServiceUtils.handleError(response);
    //            });
  }



}
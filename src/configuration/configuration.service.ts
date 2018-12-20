//
// Author: Kevin Moyse
//
import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {ServiceUtils} from '../services/service-utils';

@Injectable()
export class ConfigurationService {

  constructor(private http: HttpClient, @Inject('baseUrl') private baseUrl: string) {}

  getConfiguration(sessionId: string): Observable<any> {
    if (sessionId !== null) {
      let headers = new HttpHeaders({
        'SessionId': sessionId
      });
      return this.http.get(this.baseUrl, {headers: headers})
        .pipe(catchError(ServiceUtils.handleError6('getConfiguration', [])));
    }
    return this.http.get(this.baseUrl)
      .pipe(catchError(ServiceUtils.handleError6('getConfiguration', [])));
  }
}

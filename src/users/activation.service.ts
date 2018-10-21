//
// Author: Kevin Moyse
//
import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {ServiceUtils} from '../services/service-utils';
import {Error} from '../services/error';

@Injectable()
export class ActivationService {

  constructor(private http: HttpClient, @Inject('baseUrl') private baseUrl: string) {}

  activate(key): Observable<any | Error> {
    let headers = new HttpHeaders();
    return this.http.get(encodeURI(this.baseUrl + '/' + key), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('activate', [])));
  }

}

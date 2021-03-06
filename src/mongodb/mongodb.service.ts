//
// Author: Kevin Moyse
//
import {Injectable, Inject} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {AuthService} from '../auth/auth.service';
import {ServiceUtils} from '../services/service-utils';
import {Error} from '../services/error';

@Injectable()
export class MongoDBService {

  constructor(private http: HttpClient, private auth: AuthService,
    @Inject('baseUrl') private baseUrl: string) {}

  // if id is provided null, then mongodb will create its own
  addDocument(collection: string, id: string, document: any): Observable<any | Error> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'SessionId': this.auth.sessionId
    });

    let uri = this.baseUrl + '/' + collection;
    if (id != null) {
      uri += '/' + id;
    }
    return this.http.post(encodeURI(uri),
      JSON.stringify(document), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('addDocument', [])));
    //            .catch((response: HttpErrorResponse) => {
    //                this.auth.handleErrorResponse(response);
    //                return ServiceUtils.handleError(response);
    //            });
  }

  deleteDocument(collection: string, id: string): Observable<any | Error> {
    let headers = new HttpHeaders({
      'SessionId': this.auth.sessionId
    });
    return this.http.delete(encodeURI(this.baseUrl + '/' + collection + '/' + id), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('deleteDocument', [])));
  }

  getDistinct(collection: string, field: string, query: any): Observable<any | Error> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'SessionId': this.auth.sessionId
    });
    return this.http.put(encodeURI(this.baseUrl + '/' + collection),
      JSON.stringify({
        'distinct': field,
        'query': query
      }), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('getDistinct', [])));
  }

  /**
   * excludeFields is a comma separated list of fields to exclude : field1,field2...
   */
  getDocument(collection: string, id: string, excludeFields?: string): Observable<any | Error> {

    //        console.debug("getDocument hello");
    //        console.debug("getDocument, this.auth=" + this.auth);
    //        console.debug("getDocument, sessionId=" + this.auth.sessionId);
    //        console.debug("getDocument hello 2");

    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'SessionId': this.auth.sessionId
    });

    //        console.debug("getDocument, headers=" + JSON.stringify(headers));

    let uri: string = this.baseUrl + '/' + collection + '/' + id;

    if (excludeFields) {
      uri += '?exclude=' + excludeFields;
    }

    return this.http.get(encodeURI(uri), {headers: headers, responseType: 'json'})
      .pipe(catchError(ServiceUtils.handleError6('getDocument', [])));
  }

  getDocuments(collection: string, query: any): Observable<any | Error> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'SessionId': this.auth.sessionId
    });
    return this.http.put(encodeURI(this.baseUrl + '/' + collection),
      JSON.stringify({
        'query': query
      }), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('getDocuments', [])));
  }

  //    match: any, group: any
  getAggregation(collection: string, agg: any[]): Observable<any | Error> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'SessionId': this.auth.sessionId
    });
    //        { 'match': match, 'group': group }
    return this.http.put(encodeURI(this.baseUrl + '/' + collection),
      JSON.stringify({
        'aggregate': agg
      }), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('getAggregation', [])));
  }

  getDocumentsSorted(collection: string, queryDocument: any, sortDocument: any): Observable<any | Error> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'SessionId': this.auth.sessionId
    });
    return this.http.put(encodeURI(this.baseUrl + '/' + collection),
      JSON.stringify({
        'query': queryDocument,
        'sort': sortDocument
      }), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('getDocumentsSorted', [])));
  }

  updateDocument(collection: string, id: string, updateDocument: any): Observable<any | Error> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json;charset=UTF-8',
      'SessionId': this.auth.sessionId
    });
    return this.http.put(encodeURI(this.baseUrl + '/' + collection + '/' + id),
      JSON.stringify(updateDocument), {headers: headers})
      .pipe(catchError(ServiceUtils.handleError6('updateDocument', [])));
    //            .catch((response: HttpErrorResponse) => {
    //                this.auth.handleErrorResponse(response);
    //                return ServiceUtils.handleError(response);
    //            });
  }
}

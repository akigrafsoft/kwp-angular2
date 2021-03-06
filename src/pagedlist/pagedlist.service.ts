//
// Author: Kevin Moyse
//
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { ServiceUtils } from '../services/service-utils';
import { Error } from '../services/error';

@Injectable()
export class PagedListService {

    constructor( private http: HttpClient, private authService: AuthService,
        @Inject( 'baseUrl' ) private baseUrl: string ) { }

    createList( factory: string, factoryParams: Object,
        listId: string, searchCriteriaBase: Object, searchCriteria: Object,
        sortCriteria: any, fromIndex: number, pageSize: number ): Observable<any | Error> {

        let request = {
            'factory': factory,
            'factoryParams': factoryParams,
            'searchCriteriaBase': searchCriteriaBase,
            'searchCriteria': searchCriteria,
            'sortCriteria': sortCriteria,
            'fromIndex': fromIndex,
            'pageSize': pageSize
        };
        let headers = new HttpHeaders( {
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        } );
        return this.http.post( this.baseUrl + '/' + listId, JSON.stringify( request ), { headers: headers } )
            .pipe( catchError( err => { this.authService.handleErrorResponse( err ); return throwError( err ); } ) )
            .pipe( catchError( ServiceUtils.handleError6( 'createList', [] ) ) );
    }

    refreshList( listId ) {
        // console.log("PagedListService::refreshList()");
        let request = {};
        let headers = new HttpHeaders( {
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        } );
        return this.http.post( this.baseUrl + '/' + listId, JSON.stringify( request ), { headers: headers } )
            .pipe( catchError( err => { this.authService.handleErrorResponse( err ); return throwError( err ); } ) )
            .pipe( catchError( ServiceUtils.handleError6( 'refreshList', [] ) ) );
    }

    searchList( listId, searchCriteria,
        sortCriteria, fromIndex, pageSize ) {
        let request = {
            'searchCriteria': searchCriteria,
            'sortCriteria': sortCriteria,
            'fromIndex': fromIndex,
            'pageSize': pageSize
        };
        let headers = new HttpHeaders( {
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        } );
        return this.http.put( encodeURI( this.baseUrl + '/' + listId ),
            JSON.stringify( request ), { headers: headers } )
            .pipe( catchError( err => { this.authService.handleErrorResponse( err ); return throwError( err ); } ) )
            .pipe( catchError( ServiceUtils.handleError6( 'searchList', [] ) ) );
    }

    sortList( listId, sortCriteria, fromIndex,
        pageSize ) {
        let request = {
            'sortCriteria': sortCriteria,
            'fromIndex': fromIndex,
            'pageSize': pageSize
        };
        let headers = new HttpHeaders( {
            'Content-Type': 'application/json;charset=UTF-8',
            'SessionId': this.authService.sessionId
        } );
        return this.http.put( encodeURI( this.baseUrl + '/' + listId ),
            JSON.stringify( request ),
            { headers: headers } )
            .pipe( catchError( err => { this.authService.handleErrorResponse( err ); return throwError( err ); } ) )
            .pipe( catchError( ServiceUtils.handleError6( 'sortList', [] ) ) );
    }

    getPage( listId, fromIndex, pageSize ) {
        let headers = new HttpHeaders( {
            'SessionId': this.authService.sessionId
        } );
        return this.http.get( encodeURI( this.baseUrl + '/' + listId + '/' + fromIndex + '/' + pageSize ), { headers: headers } )
            .pipe( catchError( err => { this.authService.handleErrorResponse( err ); return throwError( err ); } ) )
            .pipe( catchError( ServiceUtils.handleError6( 'getPage', [] ) ) );
    }

}

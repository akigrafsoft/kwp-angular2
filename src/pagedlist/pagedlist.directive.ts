//
// Author: Kevin Moyse
//
import { Directive, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { PagedListService } from './pagedlist.service';
import { Error } from '../services/error';

@Directive( {
    selector: '[kwp-paged-list]',
    exportAs: 'kwpPagedList'
} )
export class PagedListDirective implements OnInit, OnChanges {

    @Input( 'kwp-paged-list' )
    factory: string;

    @Input( 'factory-params' )
    public factoryParams: Object = null;

    private _listId: string = null;
    @Input( 'listId' )
    set listId( id: string ) {
        //    console.debug("PagedList::listId(" + id + ")");
        this._listId = id;
    }

    private _pageSize = 25;
    @Input( 'pageSize' )
    set pageSize( ps: number ) {
        this._pageSize = ps;
        if ( this.initDone ) {
            this.getItems( 0, this._pageSize );
        }
    }
    get pageSize(): number {
        return this._pageSize;
    }

    @Input( 'searchCriteriasBase' )
    searchCriteriasBase: any = null;

    private _searchCriterias: any = null;
    @Input( 'searchCriterias' )
    set searchCriterias( searchCriterias: any ) {
        //    console.debug("PagedList::searchCriterias(" + JSON.stringify(searchCriterias) + ")");
        this._searchCriterias = searchCriterias;
        //    if (this.initDone) {
        //      this.search(searchCriterias);
        //    }
    }

    @Input() sortCriteria: string = null;
    @Input() reverse: false;

    @Output() onItemsSet = new EventEmitter<any[]>();

    items: any[];

    public fullSize: number;
    public filteredSize: number;

    fromIndex = 0;

    public currentPage = 0;
    // This is important to set default to 0 so that pagination buttons are disabled if the createList returned error
    public nbPages = 0;

    private initDone = false;

    public error: Error = null;

    constructor(
        private pagedListService: PagedListService
    ) {
        // console.debug("PagedList::constructor");
    }

    ngOnInit() {
        // console.debug("PagedList::ngOnInit()");
        this.doCreateList();
        this.initDone = true;
    }

    ngOnChanges( changes: SimpleChanges ): void {
        // throw new Error("Method not implemented.");
        //    console.debug("PagedList::ngOnChanges():" + JSON.stringify(changes));
        if ( changes.listId ) {
            this.doCreateList();
        } else if ( changes.searchCriterias ) {
            this.search( this._searchCriterias );
        }
    }

    private doCreateList() {
        //    console.debug("PagedList::doCreateList(" + this._listId + ")");
        this.pagedListService.createList( this.factory, this.factoryParams,
            this._listId, this.searchCriteriasBase, this._searchCriterias,
            this.sortCriteria, this.reverse, this.fromIndex, this._pageSize )
            .subscribe( data => {
                this.handleSuccessResponse( data );
            },
            error => {
                if ( error instanceof Error ) {
                    this.error = error;
                } else {
                    console.error( 'PagedList::ngOnInit|' + error );
                    this.error = Error.build( -1, error );
                }
            } );
    }

    public refreshList() {
        // console.debug("PagedList::refreshList()");
        if ( !this.initDone ) {
            console.error( 'PagedList::refreshList()|init not done' );
            return;
        }

        this.pagedListService.refreshList( this._listId )
            .subscribe( data => {
                this.handleSuccessResponse( data );
            },
            error => {
                if ( error instanceof Error ) {
                    this.error = error;
                } else {
                    console.error( 'PagedList::refreshList|' + error );
                    this.error = Error.build( -1, error );
                }
            } );
    }

    private getItems( fromIndex, pageSize ) {
        this.pagedListService.getPage( this._listId, fromIndex, pageSize )
            .subscribe( data => {
                this.handleSuccessResponse( data );
            },
            error => {
                if ( error instanceof Error ) {
                    this.error = error;
                } else {
                    console.error( 'PagedList::getItems|' + error );
                    this.error = Error.build( -1, error );
                }
            } );
    }

    public getPagedItems(): any[] {
        return this.items;
    }

    public search( searchCriterias: any ): void;
    public search( searchCriterias: any, callback?: Function ): void;

    public search( searchCriterias: any, callback?: Function ): void {
        this.pagedListService.searchList( this._listId, searchCriterias, this.sortCriteria, this.reverse, this.fromIndex, this._pageSize )
            .subscribe( data => {
                this.handleSuccessResponse( data );
                if ( typeof callback !== 'undefined' ) {
                    callback();
                }
            },
            error => {
                if ( error instanceof Error ) {
                    this.error = error;
                } else {
                    console.error( 'PagedList::refreshList|' + error );
                    this.error = Error.build( -1, error );
                }
            } );
    }

    public sort( sortCriteria: string, reverse: boolean ) {
        this.pagedListService.sortList( this._listId, sortCriteria, reverse, this.fromIndex, this._pageSize )
            .subscribe( data => {
                this.handleSuccessResponse( data );
            },
            error => {
                if ( error instanceof Error ) {
                    this.error = error;
                } else {
                    console.error( 'PagedList::refreshList|' + error );
                    this.error = Error.build( -1, error );
                }
            } );
    }

    public prevPage() {
        // console.debug("PagedList::prevPage:" + (this.currentPage - 1));
        if ( this.currentPage > 0 ) {
            this.getItems(( this.currentPage - 1 ) * this._pageSize, this._pageSize );
        }
    };
    public nextPage() {
        // console.debug("PagedList::nextPage:" + (this.currentPage + 1));
        if ( this.currentPage < ( this.nbPages - 1 ) ) {
            this.getItems(( this.currentPage + 1 ) * this._pageSize, this._pageSize );
        }
    };

    private handleSuccessResponse( data: any ) {
        // console.debug("PagedList::handleSuccessResponse(" + JSON.stringify(response) + ")");
        this.items = data.items;

        this.onItemsSet.emit( this.items );

        this.fullSize = data.itemsFullSize;
        this.filteredSize = data.itemsFilteredSize;
        this.fromIndex = data.fromIndex;
        this.sortCriteria = data.sortCriteria;
        this.reverse = data.reverse;
        this.currentPage = Math
            .ceil( data.fromIndex
            / this._pageSize );
        this.nbPages = Math
            .ceil( this.filteredSize
            / this._pageSize );
    }

}

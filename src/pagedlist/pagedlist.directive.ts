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
        if ( this.initialized ) {
            this.getItems( 0, this._pageSize );
        }
    }
    get pageSize(): number {
        return this._pageSize;
    }

    @Input( 'searchCriteriaBase' )
    searchCriteriaBase: any = null;

    private _searchCriteria: any = null;
    @Input( 'searchCriteria' )
    set searchCriteria( searchCriteria: any ) {
        //    console.debug("PagedList::searchCriteria(" + JSON.stringify(searchCriteria) + ")");
        this._searchCriteria = searchCriteria;
    }

    private _sortCriteria: any = null;
    @Input( 'sortCriteria' )
    set sortCriteria( sortCriteria: any ) {
        //      console.debug("PagedList::sortCriteria(" + JSON.stringify(sortCriteria) + ")");
        this._sortCriteria = sortCriteria;
    }

    @Output() onItemsSet = new EventEmitter<any[]>();

    @Output() onSortCriteriaUpdate = new EventEmitter<any>();

    items: any[];

    public fullSize: number;
    public filteredSize: number;

    fromIndex = 0;

    public currentPage = 0;
    // This is important to set default to 0 so that pagination buttons are disabled if the createList returned error
    public nbPages = 0;

    private initialized = false;

    public error: Error = null;

    constructor(
        private pagedListService: PagedListService
    ) {
        // console.debug("PagedList::constructor");
    }

    ngOnInit() {
        //console.debug( "PagedList::ngOnInit()" );
        this.doCreateList();
        this.initialized = true;
    }

    ngOnChanges( changes: SimpleChanges ): void {
        // do stuff only when ngOnInit has been called
        if ( this.initialized ) {
            //console.debug( "PagedList::ngOnChanges():" + JSON.stringify( changes ) );
            if ( changes.listId ) {
                this.doCreateList();
            } else if ( changes.searchCriteria ) {
                this.search( this._searchCriteria );
            }
        }
    }

    private doCreateList() {
        //    console.debug("PagedList::doCreateList(" + this._listId + ")");
        this.pagedListService.createList( this.factory, this.factoryParams,
            this._listId, this.searchCriteriaBase, this._searchCriteria,
            this._sortCriteria, this.fromIndex, this._pageSize )
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
        if ( !this.initialized ) {
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

    public search( searchCriteria: any ): void;
    public search( searchCriteria: any, callback?: Function ): void;

    public search( searchCriteria: any, callback?: Function ): void {
        this.pagedListService.searchList( this._listId, searchCriteria, this._sortCriteria, this.fromIndex, this._pageSize )
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

    public sort( sortCriteria: any ) {
        this.pagedListService.sortList( this._listId, sortCriteria, this.fromIndex, this._pageSize )
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
        this._sortCriteria = data.sortCriteria;

        this.onSortCriteriaUpdate.emit( this._sortCriteria );

        this.currentPage = Math
            .ceil( data.fromIndex
            / this._pageSize );
        this.nbPages = Math
            .ceil( this.filteredSize
            / this._pageSize );
    }

}

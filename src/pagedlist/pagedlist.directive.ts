//
// Author: Kevin Moyse
//
import { Directive, Input, Output, EventEmitter, OnInit } from '@angular/core';
//ApplicationRef
import { AuthService } from '../auth/auth.service';
import { PagedListService } from './pagedlist.service';
import { Error } from '../services/error';

@Directive({
    selector: '[kwp-paged-list]',
    exportAs: 'kwpPagedList'
})
export class PagedListDirective implements OnInit {

    @Input('kwp-paged-list')
    factory: string;

    @Input('factory-params')
    public factoryParams: Object = null;

    private _listId: string = null;
    @Input('listId')
    set listId(id: string) {
        this._listId = id;
    }

    @Input('pageSize')
    public pageSize: number = 25;

    @Input('searchCriteriasBase')
    searchCriteriasBase: any = null;

    private _searchCriterias: any = null;
    @Input('searchCriterias')
    set searchCriterias(searchCriterias: any) {
        this._searchCriterias = searchCriterias;
        if (this.initDone)
            this.search(searchCriterias);
    }

    @Input() sortCriteria: string = null;
    @Input() reverse: boolean = false;

    @Output() onItemsSet = new EventEmitter<any[]>();

    items: any[];

    public fullSize: number;
    public filteredSize: number;

    fromIndex: number = 0;

    public currentPage: number = 0;
    // This is important to set default to 0 so that pagination buttons are disabled if the createList returned error
    public nbPages: number = 0;

    private initDone: boolean = false;

    public error: Error = null;

    constructor(private auth: AuthService,
        private pagedListService: PagedListService//,
        //private applicationRef: ApplicationRef
    ) {
        //console.debug("PagedList::constructor");
    }

    ngOnInit() {
        //console.debug("PagedList::ngOnInit()");
        //        let factoryParams = "";
        this.pagedListService.createList(this.factory, this.factoryParams,
            this._listId, this.searchCriteriasBase, this._searchCriterias,
            this.sortCriteria, this.reverse, this.fromIndex, this.pageSize)
            .subscribe(data => {
                this.handleSuccessResponse(data);
                this.initDone = true;
            },
            error => {
                if (error instanceof Error) {
                    this.error = error;
                }
                else {
                    console.error("PagedList::ngOnInit|" + error);
                    this.error = Error.build(-1, error);
                }
            });
        //            .then(response => {
        //                this.handleSuccessResponse(response);
        //                this.initDone = true;
        //            })
        //            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
    }

    public refreshList() {
        //console.debug("PagedList::refreshList()");
        if (!this.initDone) {
            console.error("PagedList::refreshList()|init not done");
            return;
        }

        this.pagedListService.refreshList(this._listId)
            .subscribe(data => {
                this.handleSuccessResponse(data);
            },
            error => {
                if (error instanceof Error) {
                    this.error = error;
                }
                else {
                    console.error("PagedList::refreshList|" + error);
                    this.error = Error.build(-1, error);
                }
            });
        //            .then(response => this.handleSuccessResponse(response))
        //            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
    }

    private getItems(fromIndex, pageSize) {
        this.pagedListService.getPage(this._listId, fromIndex, pageSize)
            .subscribe(data => {
                this.handleSuccessResponse(data);
            },
            error => {
                if (error instanceof Error) {
                    this.error = error;
                }
                else {
                    console.error("PagedList::getItems|" + error);
                    this.error = Error.build(-1, error);
                }
            });
        //            .then(response => this.handleSuccessResponse(response))
        //            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
    }

    public getPagedItems(): any[] {
        return this.items;
    }

    public search(searchCriterias: any): void;
    public search(searchCriterias: any, callback?: Function): void;

    public search(searchCriterias: any, callback?: Function): void {
        this.pagedListService.searchList(this._listId, searchCriterias, this.sortCriteria, this.reverse, this.fromIndex, this.pageSize)
            .subscribe(data => {
                this.handleSuccessResponse(data);
                if (typeof callback !== 'undefined') { callback(); };
            },
            error => {
                if (error instanceof Error) {
                    this.error = error;
                }
                else {
                    console.error("PagedList::refreshList|" + error);
                    this.error = Error.build(-1, error);
                }
            });
        //            .then(response => { this.handleSuccessResponse(response); if (typeof callback !== 'undefined') { callback(); }; })
        //            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
    }

    public sort(sortCriteria: string, reverse: boolean) {
        this.pagedListService.sortList(this._listId, sortCriteria, reverse, this.fromIndex, this.pageSize)
            .subscribe(data => {
                this.handleSuccessResponse(data);
            },
            error => {
                if (error instanceof Error) {
                    this.error = error;
                }
                else {
                    console.error("PagedList::refreshList|" + error);
                    this.error = Error.build(-1, error);
                }
            });
        //            .then(response => this.handleSuccessResponse(response))
        //            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
    }

    public prevPage() {
        //console.debug("PagedList::prevPage:" + (this.currentPage - 1));
        if (this.currentPage > 0) {
            this.getItems((this.currentPage - 1) * this.pageSize, this.pageSize);
        }
    };
    public nextPage() {
        //console.debug("PagedList::nextPage:" + (this.currentPage + 1));
        if (this.currentPage < (this.nbPages - 1)) {
            this.getItems((this.currentPage + 1) * this.pageSize, this.pageSize);
        }
    };

    private handleSuccessResponse(data: any) {
        //console.debug("PagedList::handleSuccessResponse(" + JSON.stringify(response) + ")");
        this.items = data.items;

        this.onItemsSet.emit(this.items);

        this.fullSize = data.itemsFullSize;
        this.filteredSize = data.itemsFilteredSize;
        this.fromIndex = data.fromIndex;
        this.sortCriteria = data.sortCriteria;
        this.reverse = data.reverse;
        this.currentPage = Math
            .ceil(data.fromIndex
            / this.pageSize);
        this.nbPages = Math
            .ceil(this.filteredSize
            / this.pageSize);
    }

    //    private handleErrorResponse(response: any) {
    //        this.error = {
    //            code: response.errorCode,
    //            reason: response.errorReason
    //        };
    //    }
}
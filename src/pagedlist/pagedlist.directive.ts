//
// Author: Kevin Moyse
//
import { Directive, Input, Output, EventEmitter, OnInit } from '@angular/core';
//ApplicationRef
import { AuthService } from '../auth/auth.service';
import { PagedListService } from './pagedlist.service';

@Directive({
    selector: '[kwp-paged-list]',
    exportAs: 'kwpPagedList'
})
export class PagedListDirective implements OnInit {

    @Input('kwp-paged-list')
    factory: string;

    //private listIdChanged: boolean = false;
    private _listId: string = null;
    @Input('listId')
    set listId(id: string) {
        //if (this._listId !== null && this._listId !== id) {
        //    this.listIdChanged = true;
        //}
        this._listId = id;
    }

    @Input('pageSize')
    public pageSize: number = 25;

    @Input('searchCriteriasBase')
    searchCriteriasBase: any = null;

    //private searchCriteriasChanged: boolean = false;
    private _searchCriterias: any = null;
    @Input('searchCriterias')
    set searchCriterias(searchCriterias: any) {
        this._searchCriterias = searchCriterias;
        if (this.initDone)
            this.search(searchCriterias);
    }

    @Input() sortCriteria: string = null;
    @Input() sortReverse: boolean = false;

    @Output() onItemsSet = new EventEmitter<any[]>();

    items: any[];

    public fullSize: number;
    public filteredSize: number;

    fromIndex: number = 0;

    public currentPage: number = 0;
    public nbPages: number;

    private initDone: boolean = false;

    public error: any = null;

    constructor(private auth: AuthService,
        private pagedListService: PagedListService//,
        //private applicationRef: ApplicationRef
    ) {
        //console.debug("PagedList::constructor");
    }

    ngOnInit() {
        //console.debug("PagedList::ngOnInit()");
        let factoryParams = "";
        this.pagedListService.createList(this.factory, factoryParams,
            this._listId, this.searchCriteriasBase, this._searchCriterias,
            this.sortCriteria, this.sortReverse, this.fromIndex, this.pageSize)
            .then(response => { this.handleSuccessResponse(response); })
            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });

        this.initDone = true;
    }

    //    ngDoCheck() {
    //        console.debug("PagedList::ngDoCheck()");
    //        if (this.listIdChanged) {
    //            let factoryParams = "";
    //            this.pagedListService.createList(this.factory, factoryParams,
    //                this._listId, this.searchCriteriasBase, this._searchCriterias,
    //                this.sortCriteria, this.sortReverse, this.fromIndex, this.pageSize)
    //                .then(response => { this.handleSuccessResponse(response); })
    //                .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
    //        }
    //        else if (this.searchCriteriasChanged)
    //            this.search(this._searchCriterias);
    //
    //        this.listIdChanged = false;
    //        this.searchCriteriasChanged = false;
    //    }

    public refreshList() {
        //console.debug("PagedList::refreshList()");
        this.pagedListService.refreshList(this._listId)
            .then(response => this.handleSuccessResponse(response))
            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
    }

    private getItems(fromIndex, pageSize) {
        this.pagedListService.getPage(this._listId, fromIndex, pageSize)
            .then(response => this.handleSuccessResponse(response))
            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
    }

    public getPagedItems(): any[] {
        return this.items;
    }

    public search(searchCriterias: any): void;
    public search(searchCriterias: any, callback?: Function): void;

    public search(searchCriterias: any, callback?: Function): void {
        this.pagedListService.searchList(this._listId, searchCriterias, this.sortCriteria, this.sortReverse, this.fromIndex, this.pageSize)
            .then(response => { this.handleSuccessResponse(response); if (typeof callback !== 'undefined') { callback(); }; })
            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
    }

    public sort(sortCriteria: string, sortReverse: boolean) {
        this.pagedListService.sortList(this._listId, sortCriteria, sortReverse, this.fromIndex, this.pageSize)
            .then(response => this.handleSuccessResponse(response))
            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
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

    private handleSuccessResponse(response) {
        //console.debug("PagedList::handleSuccessResponse(" + JSON.stringify(response) + ")");
        this.items = response.items;

        this.onItemsSet.emit(this.items);

        //if (this.fullSize != response.itemsFullSize) {
        //this.onListModified();
        //}
        this.fullSize = response.itemsFullSize;
        this.filteredSize = response.itemsFilteredSize;
        this.fromIndex = response.fromIndex;
        this.sortCriteria = response.sortCriteria;
        this.sortReverse = response.sortReverse;
        this.currentPage = Math
            .ceil(response.fromIndex
            / this.pageSize);
        this.nbPages = Math
            .ceil(this.filteredSize
            / this.pageSize);

        //        console.debug("PagedList::handleSuccessResponse|");
        //this.applicationRef.tick();
    }


    private handleErrorResponse(response: any) {
        this.error = {
            errorCode: response.errorCode,
            errorReason: response.errorReason
        };

        setTimeout(() => {
            this.error = null;
        }, 3000);
    }
}
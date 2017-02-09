//
// Author: Kevin Moyse
//
import { Directive, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { PagedListService } from './pagedlist.service';

@Directive({
    selector: '[kwp-paged-list]'
})
export class PagedListDirective implements OnInit {
    //    title = 'PagedList';

    @Input('kwp-paged-list')
    factory: string;

    @Input('listId')
    listId: string;

    @Input('pageSize')
    pageSize: number = 25;

    @Input('searchCriteriasBase')
    searchCriteriasBase: any = null;

    private _searchCriterias: any = null;
    @Input('searchCriterias')
    set searchCriterias(searchCriterias: any) {
        if (this.created)
            this.search(searchCriterias);
        else
            this._searchCriterias = searchCriterias;
    }

    @Input() sortCriteria: string = null;
    @Input() sortReverse: boolean = false;

    @Output() onItemsSet = new EventEmitter<any[]>();

    items: any[];

    fullSize: number;
    filteredSize: number;

    fromIndex: number = 0;

    currentPage: number = 0;
    nbPages: number;

    private created: boolean = false;

    public error: any = null;

    constructor(private auth: AuthService, private pagedListService: PagedListService) {
        //console.debug("PagedListComponent::constructor");
    }

    ngOnInit() {
        //console.debug("PagedListComponent::ngOnInit()");
        let factoryParams = "";
        this.pagedListService.createList(this.factory, factoryParams,
            this.listId, this.searchCriteriasBase, this._searchCriterias,
            this.sortCriteria, this.sortReverse, this.fromIndex, this.pageSize)
            .then(response => { this.created = true; this.handleSuccessResponse(response); })
            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
    }

    refreshList() {
        //console.debug("PagedListComponent::refreshList()");
        this.pagedListService.refreshList(this.listId)
            .then(response => this.handleSuccessResponse(response))
            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
    }

    private getItems(fromIndex, pageSize) {
        this.pagedListService.getPage(this.listId, fromIndex, pageSize)
            .then(response => this.handleSuccessResponse(response))
            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
    }

    public getPagedItems(): any[] {
        return this.items;
    }

    public search(searchCriterias: any): void;
    public search(searchCriterias: any, callback?: Function): void;

    public search(searchCriterias: any, callback?: Function): void {
        this.pagedListService.searchList(this.listId, searchCriterias, this.sortCriteria, this.sortReverse, this.fromIndex, this.pageSize)
            .then(response => { this.handleSuccessResponse(response); if (typeof callback !== 'undefined') { callback(); }; })
            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
    }

    public sort(sortCriteria: string, sortReverse: boolean) {
        this.pagedListService.sortList(this.listId, sortCriteria, sortReverse, this.fromIndex, this.pageSize)
            .then(response => this.handleSuccessResponse(response))
            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
    }

    public prevPage() {
        //console.debug("PagedListComponent::prevPage:" + (this.currentPage - 1));
        if (this.currentPage > 0) {
            this.getItems((this.currentPage - 1) * this.pageSize, this.pageSize);
        }
    };
    public nextPage() {
        //console.debug("PagedListComponent::nextPage:" + (this.currentPage + 1));
        if (this.currentPage < (this.nbPages - 1)) {
            this.getItems((this.currentPage + 1) * this.pageSize, this.pageSize);
        }
    };

    private handleSuccessResponse(response) {
        //console.debug("PagedListComponent::handleSuccessResponse(" + JSON.stringify(response) + ")");
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
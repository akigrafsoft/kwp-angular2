//
// Author: Kevin Moyse
//
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

import { UserFormComponent } from './user-form.component';
import { PagedListDirective } from '../pagedlist/pagedlist.directive';

import { UserService } from './user.service';
import { User } from './user';
import { Error } from '../services/error';

@Component({
    selector: 'kwp-users',
    styles: [`
.panel-title {
margin-right: 10px;
}`],
    template: `<div>
 <div *ngIf="!authS.isAllowed('KWPUsers')">
  <div class="alert alert-danger" role="alert">not authorized</div>
 </div>
 <div *ngIf="authS.isAllowed('KWPUsers')" class="panel panel-default" [kwp-paged-list]="'Users'" [listId]="'users'"
  [pageSize]="_n" #paged="kwpPagedList">
  <div class="panel-heading">
   <span class="panel-title">{{title}}&nbsp;<span class="badge"
    title="{{paged.fullSize ? paged.fullSize : 0}} {{LANG=='fr' ? 'items au total' : 'items'}}">{{paged.fullSize ?
     paged.fullSize : 0}}</span>
   </span>
   <button type="button" class="btn btn-default glyphicon glyphicon-search"
    (click)="displayAction = displayAction==='search' ? '' : 'search'"></button>
   <button type="button" class="btn btn-default glyphicon glyphicon-plus"
    (click)="displayAction = displayAction==='add' ? '' : 'add'"></button>
  </div>
  <div id="users_body" class="panel-body">
   <div class="tools">
    <div *ngIf="paged.error" class="alert alert-danger" role="alert">{{paged.error.errorReason}}</div>
    <div *ngIf="error" class="alert alert-danger" role="alert">{{error.errorReason}}</div>
   </div>
   <div class="tools-details">
    <div [ngSwitch]="displayAction">
     <div *ngSwitchCase="'add'" class="well">
      <kwp-user-form (close)="close($event)"></kwp-user-form>
     </div>
     <div *ngSwitchCase="'search'" class="well">
      <div class="input-group">
       <span class="input-group-addon" id="username-addon1">username</span> <input #username_input type="text"
        class="form-control" placeholder="Username" aria-describedby="username-addon1"
        (keyup.enter)="searchUsername(username_input.value)">
      </div>
     </div>
     <span *ngSwitchDefault> </span>
    </div>
   </div>
   <table class="table table-striped">
    <tr>
     <th>Id</th>
     <th (click)="paged.sort('username',usernameReverse);usernameReverse=!usernameReverse">Nom<span
      [ngSwitch]="usernameReverse"> <span *ngSwitchCase="true" class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>
       <span *ngSwitchCase="false" class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> <span *ngSwitchDefault>
      </span></span></th>
     <th>Actions</th>
    </tr>
    <tr *ngFor="let user of paged.getPagedItems()">
     <td>{{user.id}}</td>
     <td (click)="doOpen(user)">{{user.username}}</td>
     <td>
      <button class="btn btn-warning btn-sm" [disabled]="delInPrgrs" data-toggle="modal" data-target="#myModal"
       (click)="selectUser(user)">
       <span class="glyphicon glyphicon-floppy-remove" aria-hidden="true"></span>
      </button>
     </td>
    </tr>
   </table>
   <div *ngIf="error" class="alert alert-danger" title="{{error.code}}">{{error.reason}}</div>
   <ul class="pagination">
    <li [class.disabled]="paged.currentPage==0"><a aria-label="Previous" (click)="paged.prevPage()"> <span
      aria-hidden="true">&laquo;</span>
    </a></li>
    <li [class.disabled]="paged.currentPage>=(paged.nbPages-1)"><a aria-label="Next" (click)="paged.nextPage()"> <span
      aria-hidden="true">&raquo;</span>
    </a></li>
   </ul>
  </div>
  <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
   <div class="modal-dialog" role="document">
    <div class="modal-content">
     <div class="modal-header">
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
       <span aria-hidden="true">&times;</span>
      </button>
      <h4 class="modal-title" id="myModalLabel">Warning</h4>
     </div>
     <div class="modal-body">Sure you want to delete User '{{user ? user.username : ""}}' ?</div>
     <div class="modal-footer">
      <button type="button" class="btn btn-success" data-dismiss="modal">Keep</button>
      <button type="button" class="btn btn-warning" data-dismiss="modal" (click)="doDelete()">Delete</button>
     </div>
    </div>
   </div>
  </div>
 </div>
</div>`
})

export class UsersComponent {

    @Input() title: string = 'Users';

    _n: number = 16;
    @Input() set n(n: number) {
        this._n = n;
    }

    user: User = null;

    authS: AuthService = null;

    delInPrgrs: boolean = false;
    error: Error = null;

    @ViewChild(PagedListDirective)
    pagedList: PagedListDirective;

    constructor(private router: Router,
        private authService: AuthService,
        private userService: UserService) {

        this.authS = authService;
    }

    doOpen(user: User) {
        //console.debug("UsersComponent::onSelect(" + JSON.stringify(user) + ")");
        let link = ['user', user.username];
        this.router.navigate(link);
    }

    selectUser(user: User) {
        this.user = user;
    }

    doDelete() {
        if (this.user === null) {
            console.error("Users::doDelete(null)");
            return;
        }

        //console.debug("UsersComponent::doDelete(" + JSON.stringify(this.user) + ")");
        this.delInPrgrs = true;
        this.userService.del(this.user.id)
            .subscribe(() => {
                this.delInPrgrs = false;
                this.pagedList.refreshList();
            },
            error => {
                this.delInPrgrs = false;
                if (error instanceof Error) {
                    this.error = error;
                    setTimeout(() => {
                        this.error = null;
                    }, 3000);
                }
                else {
                    console.error("Users::doDelete|" + error);
                }
            });
        //            .then(() => this.pagedList.refreshList())
        //            .catch(response => { this.auth.handleErrorResponse(response); this.handleErrorResponse(response); });
    }

    searchUsername(username: string) {
        //console.debug("EnvironmentsComponent::searchUsername(" + username + ")");
        if (username === '') {
            this.pagedList.search(null);
        }
        else {
            this.pagedList.search({ 'username': username });
        }
    }
    //
    //    private handleErrorResponse(response) {
    //        //console.debug("EnvironmentsComponent::handleErrorResponse(" + JSON.stringify(response) + ")");
    //
    //        let body = response.json() || null;
    //        if (body !== null) {
    //            this.error = Error.build(body.errorCode || -1, body.errorReason);
    //            setTimeout(() => {
    //                this.error = null;
    //            }, 3000);
    //        }
    //
    //    }

}

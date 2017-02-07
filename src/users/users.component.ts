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
    template: `<div class="panel panel-default">
 <div class="panel-heading">
  <span class="panel-title">{{title}}&nbsp;<span class="badge"
   title="{{pagedList.fullSize ? pagedList.fullSize : 0}} {{LANG=='fr' ? 'items au total' : 'items'}}">{{pagedList.fullSize
    ? pagedList.fullSize : 0}}</span>
  </span>
  <button type="button" class="btn btn-default glyphicon glyphicon-search"
   (click)="displayAction = displayAction==='search' ? '' : 'search'"></button>
  <button type="button" class="btn btn-default glyphicon glyphicon-plus"
   (click)="displayAction = displayAction==='add' ? '' : 'add'"></button>
 </div>
 <div id="users_body" class="panel-body">
  <div class="tools">
   <div *ngIf="pagedList.error" class="alert alert-danger" role="alert">{{pagedList.error.errorReason}}</div>
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
  <table class="table table-striped" [kwp-paged-list]="'Users'" [listId]="'users'" [pageSize]="5">
   <tr>
    <th>Id</th>
    <th (click)="pagedList.sort('username',usernameReverse);usernameReverse=!usernameReverse">Nom<span
     [ngSwitch]="usernameReverse"> <span *ngSwitchCase="true" class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span>
      <span *ngSwitchCase="false" class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> <span *ngSwitchDefault>
     </span></span></th>
    <th>Actions</th>
   </tr>
   <tr *ngFor="let user of pagedList.getPagedItems()">
    <td (click)="onSelect(user)">{{user.id}}</td>
    <td (click)="onSelect(user)">{{user.username}}</td>
    <td><span class="glyphicon glyphicon-floppy-remove" aria-hidden="true" (click)="onDelete(user)"></span></td>
   </tr>
  </table>
  <div *ngIf="error" class="alert alert-danger" title="{{error.code}}">{{error.reason}}</div>
  <ul class="pagination">
   <li [class.disabled]="pagedList.currentPage==0"><a aria-label="Previous" (click)="pagedList.prevPage()"> <span
     aria-hidden="true">&laquo;</span>
   </a></li>
   <li [class.disabled]="pagedList.currentPage>=(pagedList.nbPages-1)"><a aria-label="Next" (click)="pagedList.nextPage()">
     <span aria-hidden="true">&raquo;</span>
   </a></li>
  </ul>
 </div>
</div>`
})

export class UsersComponent {

    @Input() title: string = 'Users';

    private error: Error = null;

    @ViewChild(PagedListDirective)
    private pagedList: PagedListDirective;

    constructor(private router: Router,
        private auth: AuthService,
        private userService: UserService) {
    }

    onSelect(user: User) {
        console.debug("UsersComponent::onSelect(" + JSON.stringify(user) + ")");
        let link = ['user', user.username];
        this.router.navigate(link);
    }

    onDelete(user: User, event) {
        console.debug("UsersComponent::onDelete(" + JSON.stringify(user) + ")");
        this.userService.del(user.id)
            .subscribe(() => this.pagedList.refreshList(),
            error => {
                if (error instanceof Error) {
                    this.error = error;
                    setTimeout(() => {
                        this.error = null;
                    }, 3000);
                }
                else {
                    console.error("UsersComponent::onDelete|" + error);
                }
            });
        //            .then(() => this.pagedList.refreshList())
        //            .catch(response => { this.auth.handleErrorResponse(response); this.handleErrorResponse(response); });
    }

    searchUsername(username: string) {
        console.debug("EnvironmentsComponent::searchUsername(" + username + ")");
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

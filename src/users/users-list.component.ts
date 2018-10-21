//
// Author: Kevin Moyse
//
import {Component, ViewChild, Input, Output, EventEmitter} from '@angular/core';

import {AuthService} from '../auth/auth.service';
import {PagedListDirective} from '../pagedlist/pagedlist.directive';

import {User} from './user';
import {Error} from '../services/error';

import {UserService} from './user.service';

@Component({
  selector: 'kwp-users-list',
  styles: [`
`],
  template: `<div class="panel panel-default" [kwp-paged-list]="'Users'" [listId]="'users'" [pageSize]="_n" #paged="kwpPagedList">
 <div class="panel-heading clearfix">
  <span>{{_l==='fr' ? 'Utilisateurs' : 'Users'}}</span> &nbsp;<span class="badge">{{paged.fullSize ? paged.fullSize : 0}}</span>
  <div class="btn-toolbar pull-right" role="toolbar" aria-label="...">
   <div class="btn-group btn-group-xs" role="group" aria-label="...">
    <button type="button" class="btn btn-default" (click)="displayAction = displayAction==='search' ? '' : 'search'">
     <span class="glyphicon glyphicon-search" aria-hidden="true"></span>
    </button>
    <button *ngIf="_as.isAllowed('Create_User')&&createButton" type="button" class="btn btn-default" (click)="createUser=true">
     <span class="glyphicon glyphicon-plus" aria-hidden="true"></span>
    </button>
    <button class="btn btn-default" (click)="paged.refreshList()">
     <span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>
    </button>
   </div>
   <div class="btn-group btn-group-xs" role="group" aria-label="...">
    <button type="button" class="btn btn-default" [class.disabled]="paged.currentPage == 0" (click)="paged.prevPage()">&laquo;</button>
    <button type="button" class="btn btn-default" [class.disabled]="paged.currentPage >= (paged.nbPages-1)"
     (click)="paged.nextPage()">&raquo;</button>
   </div>
  </div>
 </div>
 <div id="users_body" class="panel-body">
  <div *ngIf="paged.error" class="alert alert-danger" role="alert">{{paged.error.reason}}</div>
  <div *ngIf="error" class="alert alert-danger" role="alert">{{error.reason}}</div>
  <div class="table-responsive">
   <table class="table table-striped">
    <tr>
     <th (click)="paged.sort('username',usernameReverse);usernameReverse=!usernameReverse"><span>{{_l==='fr' ?
       'Utilisateur' : 'Username'}}</span><span [ngSwitch]="usernameReverse"> <span *ngSwitchCase="true"
       class="glyphicon glyphicon-arrow-down" aria-hidden="true"></span> <span *ngSwitchCase="false"
       class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> <span *ngSwitchDefault> </span></span></th>
     <th>Id</th>
     <th>{{_l==='fr' ? 'Prénom' : 'Firstname'}}</th>
     <th>{{_l==='fr' ? 'Nom' : 'Lastname'}}</th>
     <th>Roles</th>
     <th>Actions</th>
    </tr>
    <tr *ngIf="displayAction==='search'">
     <td><input #un_input type="text" class="form-control" placeholder="Username"
      (keyup.enter)="searchUsername(un_input.value)"></td>
     <td></td>
     <td></td>
     <td><input #ln_input type="text" class="form-control" placeholder="Lastname"
      (keyup.enter)="searchLastname(ln_input.value)"></td>
     <td></td>
     <td></td>
    </tr>
    <tr *ngFor="let user of paged.getPagedItems()">
     <td><button class="btn btn-xs btn-default" type="button" (click)="doSelectUser(user)">{{user.username}}</button></td>
     <td>{{user | objectId}}</td>
     <td>{{user.firstName}}</td>
     <td>{{user.lastName}}</td>
     <td>{{user.roles}}</td>
     <td>
      <button *ngIf="_as.isAllowed('Edit_User')" class="btn btn-warning btn-xs" (click)="doEdit(user)">
       <span class="glyphicon glyphicon-pencil" aria-hidden="true"></span>
      </button>
      <button *ngIf="_as.isAllowed('Delete_User')" id="del" class="btn btn-warning btn-xs" [disabled]="delInPrgrs"
       data-toggle="modal" data-target="#myModal" (click)="modalSelectUser(user)">
       <span class="glyphicon glyphicon-floppy-remove" aria-hidden="true"></span>
      </button>
     </td>
    </tr>
   </table>
  </div>
  <div *ngIf="error" class="alert alert-danger" title="{{error.code}}">{{error.reason}}</div>
 </div>
 <div class="panel-footer" *ngIf="createUser">
  <kwp-user-form [LANG]="_l" [user]="null" (onCreated)="createUser=false;paged.refreshList()" (onCancelled)="createUser=false"></kwp-user-form>
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
    <div class="modal-body">{{_l==='fr' ? 'Etes vous sûr de vouloir supprimer' : 'Sure you want to delete User'}} '{{user
     ? user.username : ""}}' ?</div>
    <div class="modal-footer">
     <button type="button" class="btn btn-success" data-dismiss="modal">Keep</button>
     <button type="button" class="btn btn-warning" data-dismiss="modal" (click)="doDelete()">Delete</button>
    </div>
   </div>
  </div>
 </div>
</div>`
})

export class UsersListComponent {

  _l = 'en';
  @Input() set LANG(l: string) {
    this._l = l;
  }

  @Input() createButton = true;

  _n = 16;
  @Input() set n(n: number) {
    this._n = n;
  }

  @Output() onSelected = new EventEmitter<User>();

  @Output() onEdit = new EventEmitter<User>();

  user: User = null;
  //  e_user: User = null;

  createUser = false;

  usernameReverse = false;
  displayAction = '';

  delInPrgrs = false;
  error: Error = null;

  @ViewChild(PagedListDirective)
  pagedList: PagedListDirective;

  constructor(
    private userService: UserService,
    public _as: AuthService) {
  }

  public refreshList() {
    this.pagedList.refreshList();
  }

  doSelectUser(user: any) {
    this.onSelected.emit(user);
  }

  doEdit(user: any) {
    this.onEdit.emit(user);
  }

  modalSelectUser(user: any) {
    this.user = User.build(user);
  }

  doDelete() {
    if (this.user === null) {
      console.error('Users::doDelete(null)');
      return;
    }

    // console.debug("Users::doDelete(" + JSON.stringify(this.user) + ")");
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
        } else {
          console.error('Users::doDelete|' + error);
        }
      });
  }

  searchUsername(buffer: string) {
    // console.debug("Users::searchUsername(" + username + ")");
    if (buffer === '') {
      this.pagedList.search(null);
    } else {
      this.pagedList.search({'username': buffer});
    }
  }

  searchLastname(buffer: string) {
    if (buffer === '') {
      this.pagedList.search(null);
    } else {
      this.pagedList.search({'lastName': buffer});
    }
  }

}

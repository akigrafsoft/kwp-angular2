//
// Author: Kevin Moyse
//
import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

import { UserFormComponent } from './user-form.component';
import { PagedListDirective } from '../pagedlist/pagedlist.directive';

import { UserService } from './user.service';
import { User } from '../user';

@Component({
    selector: 'my-users',
    //    templateUrl: 'app/kwp/users/users.component.html',
    //    styleUrls: ['app/kwp/users/users.componens']

    styles: [`
    .panel-title {
        margin-right: 10px;
    }
    `],
    template: `
<div>
    <div class="panel panel-default">
        <div class="panel-heading">
            <span class="panel-title">{{title}}&nbsp;<span class="badge"
                title="{{pagedList.fullSize ?
                pagedList.fullSize : 0}} {{LANG=='fr' ? 'items au total' : 'items'}}">{{pagedList.fullSize
                    ? pagedList.fullSize : 0}}</span>
            </span>
            <button type="button"
                class="btn btn-default glyphicon glyphicon-search"
                (click)="displayAction = displayAction==='search' ? '' : 'search'"></button>
            <button type="button"
                class="btn btn-default glyphicon glyphicon-plus"
                (click)="displayAction = displayAction==='add' ? '' : 'add'"></button>
        </div>
        <div id="users_body" class="panel-body">

            <!-- tools -->
            <div class="tools">

                <div *ngIf="pagedList.error" class="alert alert-danger" role="alert">{{pagedList.error.errorReason}}</div>
                <div *ngIf="error" class="alert alert-danger" role="alert">{{error.errorReason}}</div>
            </div>
            <!-- tools -->

            <!-- tools details -->
            <div class="tools-details">
                <div [ngSwitch]="displayAction">
                    <div *ngSwitchCase="'add'" class="well">
                        <kwp-user-form (close)="close($event)"></kwp-user-form>
                    </div>
                    <div *ngSwitchCase="'search'" class="well">
                        <div class="input-group">
                            <span class="input-group-addon" id="username-addon1">username</span>
                            <input #username_input type="text" class="form-control"
                                placeholder="Username" aria-describedby="username-addon1"
                                (keyup.enter)="searchUsername(username_input.value)">
                        </div>
                    </div>
                    <span *ngSwitchDefault> </span>
                </div>
            </div>
            <!-- tools details -->

            <!-- paged list -->
            <table class="table table-striped" [kwp-paged-list]="'Users'"
                [listId]="'users'" [pageSize]="5">
                <tr>
                    <th
                        (click)="pagedList.sort('username',usernameReverse);usernameReverse=!usernameReverse">
                        Nom<span [ngSwitch]="usernameReverse"> <span
                            *ngSwitchCase="true" class="glyphicon glyphicon-arrow-down"
                            aria-hidden="true"></span> <span *ngSwitchCase="false"
                            class="glyphicon glyphicon-arrow-up" aria-hidden="true"></span> <span
                            *ngSwitchDefault> </span>
                    </span>
                    </th>
                    <th></th>
                </tr>
                <tr *ngFor="let user of pagedList.getPagedItems()">
                    <td (click)="onSelect(user)">{{user.username}}</td>
                    <td><span class="glyphicon glyphicon-floppy-remove"
                        aria-hidden="true" (click)="onDelete(user)"></span></td>
                </tr>
            </table>

            <!-- pagination -->
            <ul class="pagination">
                <li [class.disabled]="pagedList.currentPage == 0"><a
                    aria-label="Previous" (click)="pagedList.prevPage()"> <span
                        aria-hidden="true">&laquo;</span>
                </a></li>
                <li
                    [class.disabled]="pagedList.currentPage >= (pagedList.nbPages-1)">
                    <a aria-label="Next" (click)="pagedList.nextPage()"> <span
                        aria-hidden="true">&raquo;</span>
                </a>
                </li>
            </ul>
            <!-- pagination -->
        </div>
    </div>
    <div class="error" *ngIf="error">{{error}}</div>
</div>`

})

export class UsersComponent {
    title = 'Users';

    error: any;

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
        this.userService.del(user.username)
            .then(() => this.pagedList.refreshList())
            .catch(error => { this.auth.handleErrorResponse(error); this.handleErrorResponse(error.json()) });
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

    private handleErrorResponse(response) {
        console.debug("EnvironmentsComponent::handleErrorResponse(" + JSON.stringify(response) + ")");
        this.error = {
            errorCode: response.errorCode,
            errorReason: response.errorReason
        };

        setTimeout(() => {
            this.error = null;
        }, 3000);
    }

}

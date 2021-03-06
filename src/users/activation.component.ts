//
// Author: Kevin Moyse
//
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {ActivationService} from './activation.service';

import {User} from './user';
import {Error} from '../services/error';

// use template instead of templateUrl to build a library
// don't put indented html, for package size optimization
@Component({
  selector: 'kwp-activation',
  //    templateUrl: 'app/kwp/users/activation.component.html',
  template: `<form name="activationForm" (ngSubmit)="onSubmit(key)" #f="ngForm">
 <div class="form-group">
  <label for="a-key">{{LANG=='fr' ? 'Activation' : 'Activation key'}}</label> <input class="form-control" required type="text"
   id="a-key" name="a-key" placeholder="{{LANG=='fr' ? 'Entrez la clef reçue par email' : 'Enter key received by email'}}"
   [(ngModel)]="key">
 </div>
 <div *ngIf="error" class="alert alert-danger" title="{{error.code}}">{{error.reason}}</div>
 <button type="submit" class="btn btn-primary pull-right" [disabled]="!f.form.valid||inPrgs">Activer</button>
</form>`
})
export class ActivationComponent {

  @Input() LANG = 'en';
  @Input() key: string = null;
  @Output() onSuccess = new EventEmitter<User>();

  inPrgs = false;
  error: Error = null;

  constructor(
    private activationService: ActivationService) {
  }

  onSubmit(key) {
    this.inPrgs = true;
    this.activationService.activate(key).subscribe(json => {
      this.inPrgs = false;
      this.onSuccess.emit(User.build(json));
    }, error => {
      this.inPrgs = false;
      if (error instanceof Error) {
        this.error = error;
        setTimeout(() => {
          this.error = null;
        }, 3000);
      } else {
        console.error('Activation::onSubmit(' + key + ')|' + error);
      }
    });
  }
}

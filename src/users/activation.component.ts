//
// Author: Kevin Moyse
//
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';

import { ActivationService } from './activation.service';

// use template instead of templateUrl to build a library
// don't put indented html, for package size optimization
@Component({
    selector: 'kwp-activation',
    //    templateUrl: 'app/kwp/users/activation.component.html',
    template: `
<form class="form-horizontal" name="activationForm" (ngSubmit)="onSubmit(typedKey)" #activationForm="ngForm">
<div class="form-group"><label class="col-sm-2 control-label" for="key">Entrez la clef d'activation reçue par email</label>
<div class="col-lg-4 col-md-6 col-sm-10"><input class="form-control" required type="text" id="key" name="key" [(ngModel)]="typedKey"></div></div>
<div class="form-group"><div class="col-sm-offset-2 col-lg-4 col-md-6 col-sm-10 alert-warning" *ngIf="error">{{error.errorReason}}</div></div>
<div class="form-group"><div class="col-sm-offset-2 col-lg-4 col-md-6 col-sm-10">
<button type="submit" class="btn btn-default" [disabled]="processing" [disabled]="!activationForm.form.valid">Activer<img [hidden]="!processing" src="img/processing.gif" alt="processing..." height="24px" />
</button></div></div></form>`
})
export class ActivationComponent {

    processing: boolean = false;
    error: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private activationService: ActivationService) {
    }

    onSubmit(key) {
        this.processing = true;
        this.activationService.activate(key).then(() => {
            this.processing = false;
            let link = [''];
            console.debug("ActivationComponent::goto(" + JSON.stringify(link) + ")");
            this.router.navigate(link);
        }).catch(error => this.handleErrorResponse(error));
    }

    public handleErrorResponse(response: any) {
        this.processing = false;
        console.debug("ActivationComponent::handleError(" + response + ")");

        this.error = response.json();

        let status = +response.status;
        //console.log("ActivationComponent::handleError(status:" + status + ")");
        if (status == 403) {
            //let error = response.json();
            //console.log("ActivationComponent::handleError(status:" + status + ") reason:" + error.errorReason);
        } else if (status == 419) {
        }
    }
}
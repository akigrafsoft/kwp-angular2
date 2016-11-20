//
// Author: Kevin Moyse
//
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';

import { ActivationService } from './activation.service';

@Component({
    selector: 'kwp-activation',
    templateUrl: 'app/kwp/users/activation.component.html',
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
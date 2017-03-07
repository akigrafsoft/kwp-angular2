//
// Author: Kevin Moyse
//
import { Component, ViewChild, ElementRef, EventEmitter, Input, Output } from '@angular/core';
//ApplicationRef

import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'kwp-file-upload',
    template: `<div><input #input type='file' (change)='onChange()' name='{{name}}'/>
<div *ngIf="compPercent>=0" class="progress">
<div #progress class="progress-bar" role="progressbar" [attr.aria-valuenow]="compPercent" aria-valuemin="0" aria-valuemax="100" [ngStyle]="{width: (compPercent < 100 ? compPercent : 100) + '%'}">
<span class="sr-only">{{compPercent}}% Complete</span>
</div></div></div>`
})
// probably requires the PercentPipe to be loaded in the app
//[ngStyle]="{'width':compPercent|percent:'1.0-1'}"
export class UploadComponent {
    @Input() name: string;
    @Input() uploadUrl: string;

    @ViewChild('input') elt_input: ElementRef;
    @ViewChild('progress') elt_progress: ElementRef;

    private compPercent: number = -1;

    @Output() onUploaded = new EventEmitter<any>();

    constructor(
        private authService: AuthService
        //private ref: ApplicationRef
    ) { }

    onChange() {
        let files = this.elt_input.nativeElement.files;
        //        this.files = [];
        //        for (var i = 0; i < files.length; i++) {
        //            console.debug("FileUpload::upload:" + JSON.stringify(files[i]));
        //            this.filf;
        //        }

        var file = files[0], r = new FileReader();

        // console.debug("FileUpload::readAsArrayBuffer(" + file + ")");
        r.readAsArrayBuffer(file);

        var fd = new FormData();
        fd.append("file", file);

        let _self = this;

        var xhr = new XMLHttpRequest();
        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                _self.compPercent = Math.round(e.loaded / e.total) * 100;
                //_self.ref.tick();
            }
        };

        xhr.open('POST', this.uploadUrl);
        xhr.setRequestHeader('SessionId',
            this.authService.sessionId);

        xhr.onreadystatechange = () => {
            //console.debug('kwpUpload::onreadystatechange readyState=' + xhr.readyState);
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status == 200) {
                    //console.debug('kwpUpload::onreadystatechange emit:' + JSON.stringify(xhr.responseText));
                    this.onUploaded.emit(JSON.parse(xhr.responseText));
                } else {
                    console.debug('Upload::onreadystatechange error');
                }
            }
        };

        xhr.send(fd);
    }
}
//
// Author: Kevin Moyse
//
import { Component, ViewChild, ElementRef, EventEmitter, Input, Output } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'kwp-file-upload',
    template: `
<div>
 <input #input type='file' (change)='onChange()' name='{{name}}'/>
</div>
`
})
export class UploadComponent {
    @Input() name: string;
    @Input() uploadUrl: string;

    @ViewChild('input') elt_input: ElementRef;

    private percentCompleted: number = -1;

    @Output() onUploaded = new EventEmitter<any>();

    constructor(private auth: AuthService) {
    }

    onChange() {
        let files = this.elt_input.nativeElement.files;
        //        this.files = [];
        //        for (var i = 0; i < files.length; i++) {
        //            console.debug("FileUploadComponent::upload:" + JSON.stringify(files[i]));
        //            this.filf;
        //        }

        var file = files[0], r = new FileReader();

        // console.debug("FileUploadComponent::readAsArrayBuffer(" + file + ")");
        r.readAsArrayBuffer(file);

        var fd = new FormData();
        fd.append("file", file);

        var xhr = new XMLHttpRequest();
        xhr.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                //                this
                //                    .$apply(function() {
                //                        this.percentCompleted = Math
                //                            .round(e.loaded
                //                            / e.total
                //                            * 100);
                //                    });
            }
        };

        xhr.open('POST', this.uploadUrl);
        xhr.setRequestHeader('SessionId',
            this.auth.sessionId);

        xhr.onreadystatechange = () => {

            console.log('kwpUpload::onreadystatechange readyState=' + xhr.readyState);

            if (xhr.readyState === XMLHttpRequest.DONE) {

                console.log('kwpUpload::onreadystatechange status=' + xhr.status);

                if (xhr.status == 200) {
                    console.log('kwpUpload::onreadystatechange emit:' + JSON.stringify(xhr.responseText));
                    this.onUploaded.emit(JSON.parse(xhr.responseText));
                } else {
                    console
                        .log('kwpUpload::onreadystatechange error');
                }
            }
        };

        xhr.send(fd);
    }
}
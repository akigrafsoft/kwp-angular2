import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UploadComponent} from './upload.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [UploadComponent],
  exports: [UploadComponent]
  // Do not specify app-wide singleton providers in a shared module.
  // A lazy-loaded module that imports that shared module makes its own copy of the service.
  // providers: [FileService]
})
export class FilesModule {}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

// import {ConfigurationResolver} from './configuration.resolver';
// import {ConfigurationService} from './configuration.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  // Do not specify app-wide singleton providers in a shared module.
  // A lazy-loaded module that imports that shared module makes its own copy of the service.
  // providers: [ConfigurationResolver, ConfigurationService]
})
export class ConfigurationModule {}

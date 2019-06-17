import { NgModule } from '@angular/core';
import { MainContentComponent } from './main-content.component';
import { MainContentHeaderComponent } from './main-content-header.component';
import { MainContentBodyComponent } from './main-content-body.component';

@NgModule({
  declarations: [
    MainContentComponent,
    MainContentHeaderComponent,
    MainContentBodyComponent,
  ],
  exports: [
    MainContentComponent,
    MainContentHeaderComponent,
    MainContentBodyComponent,
  ],
})
export class MainContentModule { }

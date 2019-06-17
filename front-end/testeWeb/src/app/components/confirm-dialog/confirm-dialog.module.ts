import { NgModule, ModuleWithProviders } from '@angular/core';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';


@NgModule({
  imports: [
    SharedModule,
    ConfirmDialogModule
  ],
  declarations: [
    ConfirmDialogComponent,
  ],
  exports: [
    ConfirmDialogComponent
  ],
})
export class PMVConfirmDialogModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PMVConfirmDialogModule,
      providers: [
        ConfirmationService,
        ConfirmDialogService,
      ]
    };
  }
}

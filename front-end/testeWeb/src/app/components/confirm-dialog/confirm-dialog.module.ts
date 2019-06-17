import { NgModule, ModuleWithProviders } from '@angular/core';
import { ConfirmDialogModule, ConfirmationService, SharedModule } from 'primeng/primeng';
import { ConfirmDialogService } from 'src/app/services/confirm-dialog.service';
import { TesteConfirmDialogComponent } from './confirm-dialog.component';


@NgModule({
  imports: [
    SharedModule,
    ConfirmDialogModule
  ],
  declarations: [
    TesteConfirmDialogComponent,
  ],
  exports: [
    TesteConfirmDialogComponent
  ],
})
export class TesteConfirmDialogModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TesteConfirmDialogModule,
      providers: [
        ConfirmationService,
        ConfirmDialogService,
      ]
    };
  }
}

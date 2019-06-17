import { Component, Input } from '@angular/core';

@Component({
  selector: 'pmv-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css'],
})
export class ConfirmDialogComponent {

  @Input() key: string;
  @Input() header: string = 'Confirmação';
  @Input() width: number = 400;
  @Input() icon: string = 'fa fa-question-circle';

}

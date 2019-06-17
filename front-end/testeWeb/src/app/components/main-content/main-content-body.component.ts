import { Component, Input } from '@angular/core';

@Component({
  selector: 'teste-main-content-body',
  template: `
    <fieldset class="section">
      <div class="container" [style]="style">
        <ng-content></ng-content>
      </div>
    </fieldset>
  `
})
export class MainContentBodyComponent {
  @Input() style: any;
  @Input() styleClass: any;
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'teste-main-content-header',
  template: `
    <header role="heading">
      <div class="container">
        <div class="row">
          <div class="col-md-8 col-sm-6 col-xs-6">
            <h2>{{ title }}</h2>
            <p class="hidden-xs">{{ subtitle }}</p>
          </div>
          <div class="col-md-4 col-sm-6 col-xs-6 btn-action">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    h2 {
      color: #2D699F;
    }
    .btn-action {
      text-align: right;
    }
  `]
})
export class MainContentHeaderComponent {
  @Input() title: string;
  @Input() subtitle: string;
}

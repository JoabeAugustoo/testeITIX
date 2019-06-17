import { Component } from '@angular/core';

@Component({
  selector: 'teste-main-content',
  template: `
    <section role="main">
      <ng-content select="main-content-header"></ng-content>
      <ng-content select="main-content-body"></ng-content>
    </section>
  `
})
export class MainContentComponent { }

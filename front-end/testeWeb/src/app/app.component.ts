import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from './app-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    public appConfig: AppConfig,
    private httpClient: HttpClient,
  ) { }

  ngOnInit() {
    Date.prototype.toJSON = function () { return this.toLocaleString('en-US'); }
  }

}

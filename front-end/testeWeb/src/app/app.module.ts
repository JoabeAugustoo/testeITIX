import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler, LOCALE_ID } from '@angular/core';
import { HttpModule } from '@angular/http';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { ServicesModule } from './services/services.module';
import { AppComponent } from './app.component';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { AppConfig } from './app-config';

registerLocaleData(localePt, 'pt');

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    ServicesModule,
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: 'en-US' },
    AppConfig,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

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
import { TesteConfirmDialogModule } from './components/confirm-dialog/confirm-dialog.module';
import { MainContentModule } from './components/main-content/main-content.module';
import { TreeTableModule, RadioButtonModule, ButtonModule, PanelModule, InputTextModule, InputMaskModule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';

registerLocaleData(localePt, 'pt');

@NgModule({
  declarations: [
    AppComponent,
    TesteConfirmDialogModule,
    MainContentModule
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    AppRoutingModule,
    ServicesModule,
    PanelModule,
    ButtonModule,
    RadioButtonModule,
    TreeTableModule,
    InputTextModule,
    TesteConfirmDialogModule,
    MainContentModule,
    InputMaskModule,
    FormsModule

  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: LOCALE_ID, useValue: 'en-US' },
    AppConfig,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

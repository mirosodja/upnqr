import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeSl from '@angular/common/locales/sl';

// primeng
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
// end primneng

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './components/table/table.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HelpComponent } from './components/help/help.component';
import { UpnqrComponent } from './components/upnqr/upnqr.component';

registerLocaleData(localeSl, 'sl');
@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    PageNotFoundComponent,
    HelpComponent,
    UpnqrComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    TableModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    ToastModule,
    DialogModule,
    MessagesModule,
    MessageModule,
    DropdownModule,
    InputTextModule,
    AppRoutingModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'sl' }, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

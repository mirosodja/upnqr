import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule} from '@angular/forms';

// primeng
import { MenubarModule } from 'primeng/menubar';
import {TableModule} from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {TooltipModule} from 'primeng/tooltip';
// end primneng

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './components/table/table.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MenubarModule,
    TableModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

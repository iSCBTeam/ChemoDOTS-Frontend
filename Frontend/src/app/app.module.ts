import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { GrowingComponent } from './growing/growing.component';
import { LinkingComponent } from './linking/linking.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';

// @ts-ignore
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    GrowingComponent,
    LinkingComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
    ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})

export class AppModule { }
